import React from 'react'

const Rubric2028 = () => {
  return (
    <section className="mt-16 space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-100">
          II Year (2028 Batch) – Real Eligibility Rubric
        </h2>
        <p className="text-sm text-slate-400 max-w-3xl">
          Your predicted package band is based on 8 checkpoints. Each parameter contributes
          marks depending on whether you meet the criteria for Up to 5 LPA, Above 5 to Below
          10 LPA, or Above 10 LPA.
        </p>
      </div>

      {/* 1. Coding Problems Solved */}
      <div className="glass-lg p-6 md:p-8 space-y-4">
        <h3 className="text-xl font-semibold text-slate-100 mb-2">1. Coding Problems Solved</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-300">
          <div>
            <h4 className="font-semibold text-sky-300 mb-2">Up to 5 LPA</h4>
            <p>
              Minimum <span className="font-semibold">250 problems</span> on any platform
              (HackerRank / CodeChef / LeetCode / SkillRack) including
              <span className="font-semibold"> 100+ LeetCode</span>. [ 10 marks ]
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-amber-300 mb-2">Above 5 to Below 10 LPA</h4>
            <p>
              Minimum <span className="font-semibold">350 problems</span> on any platform
              (HackerRank / CodeChef / LeetCode / SkillRack), including
              <span className="font-semibold"> 150+ LeetCode</span>. [ 20 marks ]
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-emerald-300 mb-2">Above 10 LPA</h4>
            <p>
              Minimum <span className="font-semibold">600 problems</span> on any platform
              (HackerRank / CodeChef / LeetCode / SkillRack), including
              <span className="font-semibold"> 200+ LeetCode</span>. [ 30 marks ]
            </p>
          </div>
        </div>
      </div>

      {/* 2. Open Source Contribution */}
      <div className="glass-lg p-6 md:p-8 space-y-4">
        <h3 className="text-xl font-semibold text-slate-100 mb-2">2. Open Source Contribution</h3>
        <p className="text-xs text-slate-400 mb-2">Minimum one of the following in each band.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-300">
          <div>
            <h4 className="font-semibold text-sky-300 mb-2">Up to 5 LPA</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Hacktoberfest: 1 accepted PR (October) [ 5 marks ]</li>
              <li>One beginner issue solved (GitHub) [ 5 marks ]</li>
              <li>GSSOC/GSoC registration + 1 PR attempt [ Feb–Apr ] [ 5 marks ]</li>
              <li>Joined GitHub issues/discussions [ 5 marks ]</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-amber-300 mb-2">Above 5 to Below 10 LPA</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Hacktoberfest: Completed (4 PR badge) [ 10 marks ]</li>
              <li>GitHub: 1–2 merged PRs (public repo) [ 5 marks ]</li>
              <li>GSSOC/GSoC: Contributor badge [ Feb–Apr ] [ 10 marks ]</li>
              <li>Contributor tag in any OSS community [ 10 marks ]</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-emerald-300 mb-2">Above 10 LPA</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>GitHub: 3+ merged PRs (public repos) [ 10 marks ]</li>
              <li>GSSOC/GSoC: Top Contributor / Gold Badge [ 20 marks ]</li>
              <li>Maintainer / co-maintainer of repo (50+ stars) [ 20 marks ]</li>
              <li>OSS organization project completed [ 20 marks ]</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 3. Competition Achievement */}
      <div className="glass-lg p-6 md:p-8 space-y-4">
        <h3 className="text-xl font-semibold text-slate-100 mb-2">3. Competition Achievement</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-300">
          <div>
            <h4 className="font-semibold text-sky-300 mb-2">Up to 5 LPA (Minimum Two)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>CodeVita Round 1 Participation [ 5 marks ]</li>
              <li>CodeChef Starters (Beginner Track) [ 10 marks ]</li>
              <li>AtCoder Beginner Contest (ABC) [A–B] [ 10 marks ]</li>
              <li>CSES Practice Milestones 1 [ 10 marks ]</li>
              <li>TopCoder SRM (Division 2) – Easy [ 5 marks ]</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-amber-300 mb-2">Above 5 to Below 10 LPA (Minimum Two)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>CodeVita Round 2 – Cleared score [ 20 marks ]</li>
              <li>Internal hackathon Winner [ 10 marks ]</li>
              <li>TechGig Practice Challenges [ 10 marks ]</li>
              <li>AlgoUtsav – NIT Preliminary Round cleared [ 20 marks ]</li>
              <li>AtCoder ABC [A–D] [ 20 marks ]</li>
              <li>Codeforces Educational Rounds [ 10 marks ]</li>
              <li>HackerEarth Circuits — Top 40% [ 20 marks ]</li>
              <li>CodeChef Long/Starters — Top 25% [ 20 marks ]</li>
              <li>CSES Practice Milestones 1 &amp; 2 [ 20 marks ]</li>
              <li>TopCoder SRM (Division 2) – Intermediate [ 10 marks ]</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-emerald-300 mb-2">Above 10 LPA (Minimum Three)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>ICPC Regional Finalist (College Level Topper) [ 30 marks ]</li>
              <li>Code Gladiators Finalist [ 20 marks ]</li>
              <li>AlgoUtsav – NIT Finalist [ 30 marks ]</li>
              <li>Codeforces Global Rank (Top 20% or better) [ 30 marks ]</li>
              <li>AtCoder Regular Contest — High Rank [ 30 marks ]</li>
              <li>HackerEarth Circuits — Top 20% [ 30 marks ]</li>
              <li>LeetCode Weekly Top 5% [ 30 marks ]</li>
              <li>CodeChef Long/Starters — Top 10% [ 30 marks ]</li>
              <li>CSES Practice Milestones 1–3 [ 30 marks ]</li>
              <li>TopCoder SRM (Division 1) [ 30 marks ]</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 4. Certificate Requirement */}
      <div className="glass-lg p-6 md:p-8 space-y-4">
        <h3 className="text-xl font-semibold text-slate-100 mb-2">4. Certificate Requirement (Minimum Two)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-300">
          <div>
            <h4 className="font-semibold text-sky-300 mb-2">Up to 5 LPA</h4>
            <p className="mb-1 font-semibold">NPTEL – Any one course</p>
            <ul className="list-disc list-inside space-y-1 mb-2">
              <li>Elite – 5 marks</li>
              <li>Silver – 10 marks</li>
              <li>Gold – 20 marks</li>
            </ul>
            <p className="mb-1 text-xs text-slate-400">Suggested NPTEL Courses:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Fundamental Algorithms</li>
              <li>Database Management System / Fundamentals of Database Systems</li>
              <li>Programming in C++</li>
            </ul>
            <p className="mt-2">Wipro Future Skills Certificate [ 10 marks ]</p>
            <p>Any one international certificate [ 10 marks ]</p>
          </div>
          <div>
            <h4 className="font-semibold text-amber-300 mb-2">Above 5 to Below 10 LPA</h4>
            <p className="mb-1 font-semibold">NPTEL – 8 week (Any one):</p>
            <ul className="list-disc list-inside space-y-1 mb-2">
              <li>DBMS / Fundamentals of Database Systems</li>
              <li>Programming in C++</li>
            </ul>
            <ul className="list-disc list-inside space-y-1">
              <li>NPTEL Elite – 5 marks, Silver – 10 marks, Gold – 20 marks</li>
              <li>Wipro Future Skills Certificate [ 10 marks ]</li>
              <li>Any one international certificate [ 10 marks ]</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-emerald-300 mb-2">Above 10 LPA</h4>
            <p className="mb-1 font-semibold">NPTEL – 12/8 week advanced courses:</p>
            <ul className="list-disc list-inside space-y-1 mb-2">
              <li>Getting Started with Competitive Programming (12 week)</li>
              <li>Introduction to Database Systems (12 week)</li>
              <li>Data Structures and Algorithms Using Java (8 week)</li>
              <li>Programming in C++ / Java (8 week)</li>
            </ul>
            <ul className="list-disc list-inside space-y-1">
              <li>Elite – 10 marks, Silver – 20 marks, Gold – 30 marks</li>
              <li>Wipro Future Skills Certificate [ 10 marks ]</li>
              <li>Any one international certificate [ 10 marks ]</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 5. CP Rating */}
      <div className="glass-lg p-6 md:p-8 space-y-4">
        <h3 className="text-xl font-semibold text-slate-100 mb-2">5. CP Rating (CodeChef / Codeforces / AtCoder)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-300">
          <div>
            <h4 className="font-semibold text-sky-300 mb-2">Up to 5 LPA (Minimum One)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>CodeChef: 1★–2★ [ 10 marks ]</li>
              <li>CodeForces: Newbie (800–999) [ 10 marks ]</li>
              <li>AtCoder: Grey (0–399) [ 10 marks ]</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-amber-300 mb-2">Above 5 to Below 10 LPA (Minimum One)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>CodeChef: 2★–3★ [ 20 marks ]</li>
              <li>CodeForces: Newbie → Pupil (1000–1199) [ 20 marks ]</li>
              <li>AtCoder: Grey → Brown (400–799) [ 20 marks ]</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-emerald-300 mb-2">Above 10 LPA (Minimum One)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>CodeChef: 3★+ [ 30 marks ]</li>
              <li>CodeForces: Pupil / Specialist (1200–1400+) [ 30 marks ]</li>
              <li>AtCoder: Green (800–1199) [ 30 marks ]</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 6. Project / Product Development Checkpoint */}
      <div className="glass-lg p-6 md:p-8 space-y-4">
        <h3 className="text-xl font-semibold text-slate-100 mb-2">6. Project / Product Development Checkpoint</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-300">
          <div>
            <h4 className="font-semibold text-sky-300 mb-2">Up to 5 LPA – Beginner Project Exposure (Minimum Three)</h4>
            <p className="text-xs text-slate-400 mb-1">Each 5 marks</p>
            <p className="mb-2">Examples:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>SIH participation</li>
              <li>Kaggle beginner notebook</li>
              <li>Open-source mini-project with 10+ GitHub stars</li>
              <li>HackWithInfy / GRiD participation</li>
              <li>Hackathons (Fortune 500 / Naan Mudhalvan / EDII / TNWISE / InnovaTN / PSB / FinTech) participation</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-amber-300 mb-2">Above 5 to Below 10 LPA – Intermediate Achievement (Minimum Three)</h4>
            <p className="text-xs text-slate-400 mb-1">Each 10 marks</p>
            <ul className="list-disc list-inside space-y-1">
              <li>SIH finalist</li>
              <li>Devfolio hackathon shortlist (Top 10)</li>
              <li>Kaggle Bronze / Top 40%</li>
              <li>College project expo Top 10</li>
              <li>Open-source mini-project with 20+ GitHub stars</li>
              <li>HackWithInfy / GRiD shortlist</li>
              <li>Amazon ML Summer School selected</li>
              <li>Hackathon finals (Fortune 500 / Naan Mudhalvan / EDII / TNWISE / InnovaTN / PSB / FinTech)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-emerald-300 mb-2">Above 10 LPA – Advanced Achievement (Minimum Three)</h4>
            <p className="text-xs text-slate-400 mb-1">Each 20 marks</p>
            <ul className="list-disc list-inside space-y-1">
              <li>SIH Winner</li>
              <li>Kaggle Silver (Top 10–20%)</li>
              <li>Devfolio national finalist</li>
              <li>Industry project excellence / research internships (IIT / IISC / NIT / DRDO / PSU)</li>
              <li>Facebook Hacker Cup Round 2 / Reply Code Challenge ranking</li>
              <li>MLH Hackathon prizes</li>
              <li>Hackathon winners (Fortune 500 / Naan Mudhalvan / EDII / TNWISE / InnovaTN / PSB / FinTech)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 7. Aptitude Checkpoint */}
      <div className="glass-lg p-6 md:p-8 space-y-4">
        <h3 className="text-xl font-semibold text-slate-100 mb-2">7. Aptitude Checkpoint (Minimum One)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-300">
          <div>
            <h4 className="font-semibold text-sky-300 mb-2">Up to 5 LPA – Each 5 marks</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>TCS NQT Cleared</li>
              <li>Internal aptitude test pass (Skillrack)</li>
              <li>Infosys Springboard skill assessments</li>
              <li>Naukri FAST cleared</li>
              <li>Unstop aptitude challenges cleared</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-amber-300 mb-2">Above 5 to Below 10 LPA – Each 10 marks</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>TCS NQT Cognitive ≥ 75%</li>
              <li>Internal aptitude test ≥ 75%</li>
              <li>Infosys Springboard ≥ 75%</li>
              <li>Naukri FAST ≥ 75%</li>
              <li>Unstop aptitude challenges ≥ 75%</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-emerald-300 mb-2">Above 10 LPA – Each 20 marks</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>HackerRank Problem Solving (Gold)</li>
              <li>TCS NQT Cognitive ≥ 85%</li>
              <li>Internal aptitude test ≥ 85%</li>
              <li>Infosys Springboard ≥ 85%</li>
              <li>Naukri FAST ≥ 85%</li>
              <li>Unstop aptitude challenges ≥ 85%</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 8. Weekly SkillRank Assessment */}
      <div className="glass-lg p-6 md:p-8 space-y-4">
        <h3 className="text-xl font-semibold text-slate-100 mb-2">8. Weekly SkillRank Assessment</h3>
        <p className="text-sm text-slate-300">
          Average score above 70 marks (5 marks), above 75 marks (10 marks), above 80 marks (15 marks).
        </p>
      </div>

      {/* Minimum Marks & Skipping Rules */}
      <div className="glass-lg p-6 md:p-8 space-y-3 text-sm text-slate-300">
        <h3 className="text-lg font-semibold text-slate-100">Minimum Marks & Final Eligibility</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Minimum <span className="font-semibold">70 marks</span> – Eligible for Below 5 LPA.</li>
          <li>Minimum <span className="font-semibold">130 marks</span> – Eligible for Above 5 to Below 10 LPA.</li>
          <li>Minimum <span className="font-semibold">260 marks</span> – Eligible for Above 10 LPA.</li>
          <li>
            From 70 to 129 marks – Eligible for Below 5 LPA; 129 to 259 marks – Eligible for Above 5 to Below
            10 LPA.
          </li>
          <li>
            Students with a valid <span className="font-semibold">GATE score</span> may skip
            <span className="font-semibold"> any three (3)</span> of the eight checkpoints.
          </li>
        </ul>
      </div>
    </section>
  )
}

export default Rubric2028
