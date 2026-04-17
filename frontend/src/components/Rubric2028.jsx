import React from 'react'

const Rubric2028 = () => {
  return (
    <section className="mt-6 space-y-8 pb-10">
      <div className="space-y-3 border-b border-slate-200 pb-6">
        <h2 className="text-2xl md:text-3xl font-extrabold text-blue-900 tracking-tight">
          II Year (2028 Batch) – Real Eligibility Rubric
        </h2>
        <p className="text-sm font-medium text-slate-500 max-w-4xl leading-relaxed">
          Your predicted package band is based on 8 checkpoints. Each parameter contributes
          marks depending on whether you meet the criteria for Up to 5 LPA, Above 5 to Below
          10 LPA, or Above 10 LPA.
        </p>
      </div>

      {/* 1. Coding Problems Solved */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 md:p-8 space-y-5">
        <h3 className="text-lg font-bold text-slate-800 border-l-4 border-blue-500 pl-3">1. Coding Problems Solved</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-600">
          <div className="bg-slate-50 p-4 rounded-lg">
            <h4 className="font-bold text-blue-700 mb-2 uppercase tracking-wide text-xs">Up to 5 LPA</h4>
            <p className="leading-relaxed">
              Minimum <span className="font-bold text-slate-800">250 problems</span> on any platform
              (HackerRank / CodeChef / LeetCode / SkillRack) including 
              <span className="font-bold text-slate-800"> 100+ LeetCode</span>. <span className="text-blue-600 font-semibold">[ 10 marks ]</span>
            </p>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg">
            <h4 className="font-bold text-amber-600 mb-2 uppercase tracking-wide text-xs">Above 5 to Below 10 LPA</h4>
            <p className="leading-relaxed">
              Minimum <span className="font-bold text-slate-800">350 problems</span> on any platform 
              (HackerRank / CodeChef / LeetCode / SkillRack), including 
              <span className="font-bold text-slate-800"> 150+ LeetCode</span>. <span className="text-amber-600 font-semibold">[ 20 marks ]</span>
            </p>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg">
            <h4 className="font-bold text-emerald-600 mb-2 uppercase tracking-wide text-xs">Above 10 LPA</h4>
            <p className="leading-relaxed">
              Minimum <span className="font-bold text-slate-800">600 problems</span> on any platform 
              (HackerRank / CodeChef / LeetCode / SkillRack), including 
              <span className="font-bold text-slate-800"> 200+ LeetCode</span>. <span className="text-emerald-600 font-semibold">[ 30 marks ]</span>
            </p>
          </div>
        </div>
      </div>

      {/* 2. Open Source Contribution */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 md:p-8 space-y-5">
        <div>
          <h3 className="text-lg font-bold text-slate-800 border-l-4 border-blue-500 pl-3 mb-1">2. Open Source Contribution</h3>
          <p className="text-xs font-semibold text-slate-400 pl-4">Minimum one of the following in each band.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-600">
          <div className="bg-slate-50 p-4 rounded-lg">
            <h4 className="font-bold text-blue-700 mb-3 uppercase tracking-wide text-xs">Up to 5 LPA</h4>
            <ul className="list-disc list-inside space-y-2 leading-relaxed">
              <li>Hacktoberfest: 1 accepted PR <span className="text-blue-600 font-medium">[ 5 marks ]</span></li>
              <li>One beginner issue solved <span className="text-blue-600 font-medium">[ 5 marks ]</span></li>
              <li>GSSOC/GSoC rep + 1 PR <span className="text-blue-600 font-medium">[ 5 marks ]</span></li>
              <li>Joined GitHub issues <span className="text-blue-600 font-medium">[ 5 marks ]</span></li>
            </ul>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg">
            <h4 className="font-bold text-amber-600 mb-3 uppercase tracking-wide text-xs">Above 5 to Below 10 LPA</h4>
            <ul className="list-disc list-inside space-y-2 leading-relaxed">
              <li>Hacktoberfest: Completed <span className="text-amber-600 font-medium">[ 10 marks ]</span></li>
              <li>GitHub: 1–2 merged PRs <span className="text-amber-600 font-medium">[ 5 marks ]</span></li>
              <li>GSSOC/GSoC: Contributor <span className="text-amber-600 font-medium">[ 10 marks ]</span></li>
              <li>Contributor tag in OSS <span className="text-amber-600 font-medium">[ 10 marks ]</span></li>
            </ul>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg">
            <h4 className="font-bold text-emerald-600 mb-3 uppercase tracking-wide text-xs">Above 10 LPA</h4>
            <ul className="list-disc list-inside space-y-2 leading-relaxed">
              <li>GitHub: 3+ merged PRs <span className="text-emerald-600 font-medium">[ 10 marks ]</span></li>
              <li>GSSOC/GSoC: Top Contributor <span className="text-emerald-600 font-medium">[ 20 marks ]</span></li>
              <li>Maintainer 50+ stars repo <span className="text-emerald-600 font-medium">[ 20 marks ]</span></li>
              <li>OSS org project completed <span className="text-emerald-600 font-medium">[ 20 marks ]</span></li>
            </ul>
          </div>
        </div>
      </div>

      {/* 3. Competition Achievement */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 md:p-8 space-y-5">
        <h3 className="text-lg font-bold text-slate-800 border-l-4 border-blue-500 pl-3">3. Competition Achievement</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-600">
          <div className="bg-slate-50 p-4 rounded-lg">
            <h4 className="font-bold text-blue-700 mb-3 uppercase tracking-wide text-xs">Up to 5 LPA (Min 2)</h4>
            <ul className="list-disc list-inside space-y-2">
              <li>CodeVita Round 1 Participation <span className="text-blue-600 font-medium">[ 5 ]</span></li>
              <li>CodeChef Starters (Beginner) <span className="text-blue-600 font-medium">[ 10 ]</span></li>
              <li>AtCoder Beginner (ABC) [A–B] <span className="text-blue-600 font-medium">[ 10 ]</span></li>
              <li>CSES Practice Milestones 1 <span className="text-blue-600 font-medium">[ 10 ]</span></li>
              <li>TopCoder SRM (Div 2) – Easy <span className="text-blue-600 font-medium">[ 5 ]</span></li>
            </ul>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg">
            <h4 className="font-bold text-amber-600 mb-3 uppercase tracking-wide text-xs">Above 5 to Below 10 LPA (Min 2)</h4>
            <ul className="list-disc list-inside space-y-2">
              <li>CodeVita Round 2 <span className="text-amber-600 font-medium">[ 20 marks ]</span></li>
              <li>Internal hackathon Winner <span className="text-amber-600 font-medium">[ 10 ]</span></li>
              <li>TechGig Practice Challenges <span className="text-amber-600 font-medium">[ 10 ]</span></li>
              <li>AlgoUtsav – NIT Prelims <span className="text-amber-600 font-medium">[ 20 ]</span></li>
              <li>AtCoder ABC [A–D] <span className="text-amber-600 font-medium">[ 20 ]</span></li>
              <li>HackerEarth Circuits Top 40% <span className="text-amber-600 font-medium">[ 20 ]</span></li>
              <li>CodeChef Starters Top 25% <span className="text-amber-600 font-medium">[ 20 ]</span></li>
            </ul>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg">
            <h4 className="font-bold text-emerald-600 mb-3 uppercase tracking-wide text-xs">Above 10 LPA (Min 3)</h4>
            <ul className="list-disc list-inside space-y-2">
              <li>ICPC Regional Finalist <span className="text-emerald-600 font-medium">[ 30 ]</span></li>
              <li>Code Gladiators Finalist <span className="text-emerald-600 font-medium">[ 20 ]</span></li>
              <li>AlgoUtsav – NIT Finalist <span className="text-emerald-600 font-medium">[ 30 ]</span></li>
              <li>Codeforces Global Top 20% <span className="text-emerald-600 font-medium">[ 30 ]</span></li>
              <li>AtCoder Regular Contest <span className="text-emerald-600 font-medium">[ 30 ]</span></li>
              <li>LeetCode Weekly Top 5% <span className="text-emerald-600 font-medium">[ 30 ]</span></li>
              <li>CodeChef Long/Starters Top 10% <span className="text-emerald-600 font-medium">[ 30 ]</span></li>
            </ul>
          </div>
        </div>
      </div>

      {/* 4. Certificate Requirement */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 md:p-8 space-y-5">
        <h3 className="text-lg font-bold text-slate-800 border-l-4 border-blue-500 pl-3">4. Certificate Requirement (Min Two)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-600">
          <div className="bg-slate-50 p-4 rounded-lg">
            <h4 className="font-bold text-blue-700 mb-3 uppercase tracking-wide text-xs">Up to 5 LPA</h4>
            <p className="mb-2 font-bold text-slate-800">NPTEL – Any one course</p>
            <ul className="list-disc list-inside space-y-1 mb-3">
              <li>Elite – 5 marks</li>
              <li>Silver – 10 marks</li>
              <li>Gold – 20 marks</li>
            </ul>
            <p className="mb-2 font-bold text-slate-800">Wipro Future Skills <span className="text-blue-600 font-medium">[ 10 marks ]</span></p>
            <p className="font-bold text-slate-800">International certificate <span className="text-blue-600 font-medium">[ 10 marks ]</span></p>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg">
            <h4 className="font-bold text-amber-600 mb-3 uppercase tracking-wide text-xs">Above 5 to Below 10 LPA</h4>
            <p className="mb-2 font-bold text-slate-800">NPTEL – 8 week (Any one):</p>
            <ul className="list-disc list-inside space-y-1 mb-3 pl-2">
              <li>DBMS / Fundamentals</li>
              <li>Programming in C++</li>
            </ul>
            <p className="mb-2 font-bold text-slate-800">Wipro Future Skills <span className="text-amber-600 font-medium">[ 10 marks ]</span></p>
            <p className="font-bold text-slate-800">International certificate <span className="text-amber-600 font-medium">[ 10 marks ]</span></p>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg">
            <h4 className="font-bold text-emerald-600 mb-3 uppercase tracking-wide text-xs">Above 10 LPA</h4>
            <p className="mb-2 font-bold text-slate-800">NPTEL – 12/8 week advanced:</p>
            <ul className="list-disc list-inside space-y-1 mb-3 pl-2 text-xs">
              <li>Competitive Programming (12w)</li>
              <li>Intro to Database Systems (12w)</li>
              <li>DSA Using Java (8w)</li>
            </ul>
            <p className="mb-2 font-bold text-slate-800">Wipro Future Skills <span className="text-emerald-600 font-medium">[ 10 marks ]</span></p>
            <p className="font-bold text-slate-800">International certificate <span className="text-emerald-600 font-medium">[ 10 marks ]</span></p>
          </div>
        </div>
      </div>

      {/* 5. CP Rating */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 md:p-8 space-y-5">
        <h3 className="text-lg font-bold text-slate-800 border-l-4 border-blue-500 pl-3">5. CP Rating (CodeChef / Codeforces / AtCoder)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-600">
          <div className="bg-slate-50 p-4 rounded-lg">
            <h4 className="font-bold text-blue-700 mb-3 uppercase tracking-wide text-xs">Up to 5 LPA (Min 1)</h4>
            <ul className="list-disc list-inside space-y-2">
              <li>CodeChef: 1★–2★ <span className="text-blue-600 font-medium">[ 10 marks ]</span></li>
              <li>CodeForces: Newbie <span className="text-blue-600 font-medium">[ 10 marks ]</span></li>
              <li>AtCoder: Grey <span className="text-blue-600 font-medium">[ 10 marks ]</span></li>
            </ul>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg">
            <h4 className="font-bold text-amber-600 mb-3 uppercase tracking-wide text-xs">5 - 10 LPA (Min 1)</h4>
            <ul className="list-disc list-inside space-y-2">
              <li>CodeChef: 2★–3★ <span className="text-amber-600 font-medium">[ 20 marks ]</span></li>
              <li>CodeForces: Pupil <span className="text-amber-600 font-medium">[ 20 marks ]</span></li>
              <li>AtCoder: Brown <span className="text-amber-600 font-medium">[ 20 marks ]</span></li>
            </ul>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg">
            <h4 className="font-bold text-emerald-600 mb-3 uppercase tracking-wide text-xs">Above 10 LPA (Min 1)</h4>
            <ul className="list-disc list-inside space-y-2">
              <li>CodeChef: 3★+ <span className="text-emerald-600 font-medium">[ 30 marks ]</span></li>
              <li>CodeForces: Specialist+ <span className="text-emerald-600 font-medium">[ 30 marks ]</span></li>
              <li>AtCoder: Green+ <span className="text-emerald-600 font-medium">[ 30 marks ]</span></li>
            </ul>
          </div>
        </div>
      </div>

      {/* 6. Project Checkpoint */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 md:p-8 space-y-5">
        <h3 className="text-lg font-bold text-slate-800 border-l-4 border-blue-500 pl-3">6. Project / Product Development</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-600">
          <div className="bg-slate-50 p-4 rounded-lg">
            <h4 className="font-bold text-blue-700 mb-2 uppercase tracking-wide text-xs">Up to 5 LPA – Beginner</h4>
            <p className="text-[11px] font-bold text-slate-400 mb-3 uppercase tracking-widest">Min 3 • Each 5 marks</p>
            <ul className="list-disc list-inside space-y-1">
              <li>SIH participation</li>
              <li>Kaggle beginner notebook</li>
              <li>10+ GitHub stars project</li>
              <li>Hackathon participation</li>
            </ul>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg">
            <h4 className="font-bold text-amber-600 mb-2 uppercase tracking-wide text-xs">5-10 LPA – Intermediate</h4>
            <p className="text-[11px] font-bold text-slate-400 mb-3 uppercase tracking-widest">Min 3 • Each 10 marks</p>
            <ul className="list-disc list-inside space-y-1">
              <li>SIH finalist</li>
              <li>Devfolio shortlist</li>
              <li>Kaggle Bronze</li>
              <li>20+ GitHub stars project</li>
            </ul>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg">
            <h4 className="font-bold text-emerald-600 mb-2 uppercase tracking-wide text-xs">10+ LPA – Advanced</h4>
            <p className="text-[11px] font-bold text-slate-400 mb-3 uppercase tracking-widest">Min 3 • Each 20 marks</p>
            <ul className="list-disc list-inside space-y-1">
              <li>SIH Winner</li>
              <li>Kaggle Silver</li>
              <li>Devfolio national finalist</li>
              <li>Research internships</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 7 & 8 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 7. Aptitude */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 md:p-8 space-y-5">
          <h3 className="text-lg font-bold text-slate-800 border-l-4 border-blue-500 pl-3">7. Aptitude (Min 1)</h3>
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex justify-between items-center bg-slate-50 p-2 rounded">
              <span className="font-bold text-blue-700">Up to 5 LPA (Cleared pass)</span>
              <span className="font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded text-xs">5 marks</span>
            </li>
            <li className="flex justify-between items-center bg-slate-50 p-2 rounded">
              <span className="font-bold text-amber-600">5-10 LPA (Score ≥ 75%)</span>
              <span className="font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded text-xs">10 marks</span>
            </li>
            <li className="flex justify-between items-center bg-slate-50 p-2 rounded">
              <span className="font-bold text-emerald-600">10+ LPA (Score ≥ 85%)</span>
              <span className="font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded text-xs">20 marks</span>
            </li>
          </ul>
        </div>
        
        <div className="space-y-6">
          {/* 8. SkillRank */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-3">
            <h3 className="text-lg font-bold text-slate-800 border-l-4 border-blue-500 pl-3">8. Weekly SkillRank</h3>
            <p className="text-sm text-slate-600 font-medium">
              Average score above 70 marks <span className="font-bold text-blue-600">(5 marks)</span>, 
              above 75 marks <span className="font-bold text-amber-600">(10 marks)</span>, 
              above 80 marks <span className="font-bold text-emerald-600">(15 marks)</span>.
            </p>
          </div>

          {/* Rules */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl shadow-sm p-6 space-y-4 text-sm text-slate-700">
            <h3 className="text-lg font-bold text-blue-900 border-l-4 border-blue-500 pl-3">Final Eligibility Rules</h3>
            <ul className="list-disc list-inside space-y-2 font-medium">
              <li>Min <span className="font-bold text-blue-800">70 marks</span> – Below 5 LPA</li>
              <li>Min <span className="font-bold text-blue-800">130 marks</span> – 5 to 10 LPA</li>
              <li>Min <span className="font-bold text-blue-800">260 marks</span> – Above 10 LPA</li>
              <li className="pt-2 border-t border-blue-200">
                Valid <span className="font-bold text-blue-800">GATE score</span> holders may skip any 3 checkpoints.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Rubric2028
