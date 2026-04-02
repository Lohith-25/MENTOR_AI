"""
Placement Eligibility Scoring Engine
Robust calculation with validation, bounds checking, and transparency
"""

import logging
from typing import Dict, List, Tuple

logger = logging.getLogger(__name__)


class ScoreCalculator:
    """
        Calculates placement eligibility score based on 8 weighted categories.
        Total score: 0-300 marks (normalized)
        Real-case eligibility thresholds (II Year 2028 batch):
            - Not Yet Eligible: < 70 marks
            - Below 5 LPA: 70-129 marks
            - Above 5 to Below 10 LPA: 130-259 marks
            - Above 10 LPA: 260+ marks
    """
    
    # Category definitions: (name, max_points, weight)
    CATEGORIES = {
        "coding_problems": {"max": 20, "weight": 0.25, "name": "Coding Skills"},
        "leetcode_problems": {"max": 20, "weight": 0.20, "name": "LeetCode"},
        "open_source": {"max": 15, "weight": 0.15, "name": "Open Source"},
        "competitions": {"max": 20, "weight": 0.15, "name": "Competitions"},
        "cp_rating": {"max": 15, "weight": 0.10, "name": "CP Rating"},
        "projects": {"max": 15, "weight": 0.10, "name": "Projects"},
        "aptitude": {"max": 20, "weight": 0.03, "name": "Aptitude"},
        "skillrank": {"max": 15, "weight": 0.02, "name": "SkillRank"},
    }

    # Maximum total score after weighting
    TOTAL_MAX_SCORE = 300
    
    # Eligibility thresholds (real-case rubric)
    ELIGIBILITY_TIERS = [
        {"min": 0, "max": 69, "tier": "Not Yet Eligible", "color": "red"},
        {"min": 70, "max": 129, "tier": "Below 5 LPA", "color": "red"},
        {"min": 130, "max": 259, "tier": "Above 5 to Below 10 LPA", "color": "yellow"},
        {"min": 260, "max": TOTAL_MAX_SCORE, "tier": "Above 10 LPA", "color": "green"},
    ]
    
    @staticmethod
    def validate_input(data: Dict) -> Tuple[bool, Dict]:
        """
        Validate input data against expected ranges and types.
        Returns: (is_valid, errors_dict)
        """
        errors = {}
        
        # Validation rules
        validations = {
            "coding_problems": {"type": (int, float), "min": 0, "max": 2000},
            "leetcode_problems": {"type": (int, float), "min": 0, "max": 3000},
            "open_source": {"type": str, "enum": ["Beginner", "Intermediate", "Advanced"]},
            "competitions": {"type": str, "enum": ["Beginner", "Intermediate", "Advanced", "Expert"]},
            "cp_rating": {"type": str, "enum": ["1-star", "2-star", "3-star", "4-star", "5-star", "6-star"]},
            "projects": {"type": str, "enum": ["Beginner", "Intermediate", "Advanced"]},
            "aptitude": {"type": (int, float), "min": 0, "max": 100},
            "skillrank": {"type": (int, float), "min": 0, "max": 100},
            "certificate_marks": {"type": (int, float), "min": 0, "max": 100, "optional": True},
        }
        
        for field, rules in validations.items():
            if field not in data:
                if rules.get("optional"):
                    continue
                errors[field] = f"Missing required field: {field}"
                continue
            
            value = data[field]
            
            # Type check
            if "type" in rules and not isinstance(value, rules["type"]):
                errors[field] = f"Invalid type. Expected {rules['type'].__name__}"
                continue
            
            # Enum validation
            if "enum" in rules and value not in rules["enum"]:
                errors[field] = f"Invalid value. Must be one of: {', '.join(rules['enum'])}"
                continue
            
            # Range validation (for numbers)
            if "min" in rules and value < rules["min"]:
                errors[field] = f"Must be >= {rules['min']}"
                continue
            
            if "max" in rules and value > rules["max"]:
                errors[field] = f"Must be <= {rules['max']}"
                continue
        
        is_valid = len(errors) == 0
        logger.info(f"Validation result: {is_valid}. Errors: {errors if errors else 'None'}")
        
        return is_valid, errors
    
    @staticmethod
    def map_input_to_scores(data: Dict) -> Dict[str, float]:
        """
        Map input values to normalized scores (0-max for each category).
        Mapping logic: convert dropdowns to numeric scores.
        """
        scores = {}
        
        # Numeric fields: direct mapping
        scores["coding_problems"] = float(data["coding_problems"])
        scores["leetcode_problems"] = float(data["leetcode_problems"])
        scores["aptitude"] = float(data["aptitude"])
        scores["skillrank"] = float(data["skillrank"])
        
        # Open Source: Beginner→5, Intermediate→10, Advanced→15
        open_source_map = {"Beginner": 5, "Intermediate": 10, "Advanced": 15}
        scores["open_source"] = open_source_map.get(data["open_source"], 0)
        
        # Competitions: Beginner→5, Intermediate→10, Advanced→15, Expert→20
        competitions_map = {"Beginner": 5, "Intermediate": 10, "Advanced": 15, "Expert": 20}
        scores["competitions"] = competitions_map.get(data["competitions"], 0)
        
        # CP Rating: 1-star→3, 2-star→6, 3-star→9, 4-star→12, 5-star→14, 6-star→15
        cp_rating_map = {
            "1-star": 3,
            "2-star": 6,
            "3-star": 9,
            "4-star": 12,
            "5-star": 14,
            "6-star": 15,
        }
        scores["cp_rating"] = cp_rating_map.get(data["cp_rating"], 0)
        
        # Projects: Beginner→5, Intermediate→10, Advanced→15
        projects_map = {"Beginner": 5, "Intermediate": 10, "Advanced": 15}
        scores["projects"] = projects_map.get(data["projects"], 0)
        
        logger.info(f"Mapped scores: {scores}")
        return scores
    
    @staticmethod
    def clamp_score(score: float, max_score: float) -> float:
        """Ensure score stays within bounds [0, max_score]"""
        return max(0, min(score, max_score))
    
    @staticmethod
    def calculate_total_score(raw_scores: Dict[str, float], certificate_marks: float = 0) -> float:
        """
        Calculate weighted total score (0-300 scale).
        Formula: Σ((category_score / max_score) × weight × TOTAL_MAX_SCORE) + certificate_marks
        
        Args:
            raw_scores: Dictionary of category scores
            certificate_marks: Additional marks from uploaded certificates (0-100, capped)
        """
        total = 0.0
        logger.info("Calculating weighted scores:")
        
        for category, config in ScoreCalculator.CATEGORIES.items():
            raw_score = raw_scores.get(category, 0)
            max_points = config["max"]
            weight = config["weight"]
            name = config["name"]
            
            # Clamp raw score to max
            clamped_score = ScoreCalculator.clamp_score(raw_score, max_points)
            
            # Weighted calculation on 0-TOTAL_MAX_SCORE scale
            normalized = (clamped_score / max_points) * weight * ScoreCalculator.TOTAL_MAX_SCORE
            total += normalized
            
            logger.info(
                f"  {name}: {clamped_score}/{max_points} × {weight} × {ScoreCalculator.TOTAL_MAX_SCORE} = {normalized:.2f}"
            )
        
        # Add certificate marks (capped at 100 max contribution to avoid exceeding 300)
        cert_contribution = ScoreCalculator.clamp_score(certificate_marks, 100)
        if cert_contribution > 0:
            logger.info(f"  Certificate marks: +{cert_contribution}")
            total += cert_contribution
        
        # Final clamp to ensure 0-TOTAL_MAX_SCORE range
        final_score = ScoreCalculator.clamp_score(total, ScoreCalculator.TOTAL_MAX_SCORE)
        logger.info(f"Total score: {final_score:.2f}/{ScoreCalculator.TOTAL_MAX_SCORE}")
        
        return round(final_score, 2)
    
    @staticmethod
    def get_eligibility(total_score: float) -> Dict:
        """Determine eligibility tier and color based on total score"""
        for tier in ScoreCalculator.ELIGIBILITY_TIERS:
            if tier["min"] <= total_score <= tier["max"]:
                logger.info(f"Eligibility: {tier['tier']} (Score: {total_score})")
                return {
                    "tier": tier["tier"],
                    "color": tier["color"],
                    "min_score": tier["min"],
                    "max_score": tier["max"],
                }
        
        # Fallback (shouldn't reach here if bounds are correct)
        return {
            "tier": "Not Yet Eligible",
            "color": "red",
            "min_score": 0,
            "max_score": 69,
        }
    
    @staticmethod
    def generate_suggestions(raw_scores: Dict[str, float]) -> List[str]:
        """Generate smart improvement suggestions based on weakest categories"""
        suggestions = []
        
        # Calculate weakness scores
        weakness_scores = []
        for category, config in ScoreCalculator.CATEGORIES.items():
            raw_score = raw_scores.get(category, 0)
            max_points = config["max"]
            percentage = (raw_score / max_points) * 100 if max_points > 0 else 0
            weakness_scores.append({
                "name": config["name"],
                "category": category,
                "percentage": percentage,
            })
        
        # Sort by weakness (lowest percentage first)
        weakness_scores.sort(key=lambda x: x["percentage"])
        
        # Generate suggestions for weakest 3 categories
        suggestion_templates = {
            "Coding Skills": "Solve 100+ more coding problems on HackerRank or CodeSignal",
            "LeetCode": "Complete 100+ LeetCode problems, focusing on Medium difficulty",
            "Open Source": "Contribute to 3+ open-source projects with meaningful PRs",
            "Competitions": "Participate in 5+ programming competitions (Codechef, Codeforces)",
            "CP Rating": "Increase competitive programming rating through consistent practice",
            "Projects": "Build 3+ full-stack projects and deploy them (GitHub + deployment)",
            "Aptitude": "Practice aptitude questions daily; target 80+ score",
            "SkillRank": "Complete 10+ projects on SkillRank platform",
        }
        
        for i, weakness in enumerate(weakness_scores[:3]):
            name = weakness["name"]
            template = suggestion_templates.get(name, f"Improve {name}")
            suggestions.append(template)
        
        logger.info(f"Generated {len(suggestions)} suggestions")
        return suggestions
    
    @staticmethod
    def get_category_breakdown(raw_scores: Dict[str, float]) -> Dict:
        """Return detailed breakdown for each category"""
        breakdown = {}
        for category, config in ScoreCalculator.CATEGORIES.items():
            raw_score = raw_scores.get(category, 0)
            max_points = config["max"]
            clamped_score = ScoreCalculator.clamp_score(raw_score, max_points)
            percentage = (clamped_score / max_points) * 100 if max_points > 0 else 0
            
            breakdown[category] = {
                "name": config["name"],
                "score": clamped_score,
                "max": max_points,
                "percentage": round(percentage, 1),
                "weight": config["weight"],
            }
        
        return breakdown
    
    @staticmethod
    def predict(input_data: Dict) -> Tuple[bool, Dict]:
        """
        Main prediction function: validates → scores → eligibility → suggestions
        Returns: (success, result_dict)
        """
        # Validate input
        is_valid, validation_errors = ScoreCalculator.validate_input(input_data)
        if not is_valid:
            logger.error(f"Validation failed: {validation_errors}")
            return False, {
                "error": "Validation failed",
                "details": validation_errors,
            }
        
        # Map to scores
        raw_scores = ScoreCalculator.map_input_to_scores(input_data)
        
        # Extract certificate marks (optional, defaults to 0)
        certificate_marks = input_data.get("certificate_marks", 0)
        
        # Calculate total score including certificate marks
        total_score = ScoreCalculator.calculate_total_score(raw_scores, certificate_marks)
        
        # Get eligibility
        eligibility = ScoreCalculator.get_eligibility(total_score)
        
        # Generate suggestions
        suggestions = ScoreCalculator.generate_suggestions(raw_scores)
        
        # Get category breakdown
        category_breakdown = ScoreCalculator.get_category_breakdown(raw_scores)
        
        result = {
            "success": True,
            "total_score": total_score,
            "eligibility": eligibility,
            "category_breakdown": category_breakdown,
            "suggestions": suggestions,
            "max_possible_score": ScoreCalculator.TOTAL_MAX_SCORE,
            "certificate_marks": certificate_marks,
        }
        
        logger.info(f"Prediction successful: {result}")
        return True, result
