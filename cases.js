/*
  Case files. Cases appear in the list in this order.

  Each case:
    id:      unique slug (also used as the save key)
    answer:  must exactly match a name in js/drugs.js
    clues:   6 x [tag, text], hardest first
    pearl:   teaching point shown after Round 1
    call:    Round 2. Keep the 4 options similar in length and detail.
             correct = index of the right option in the options array.
             slot    = which letter (0=A … 3=D) the right answer is shown as.
                       Spread these out so no letter dominates. If omitted,
                       a slot is picked from the case id.
    calc:    Round 3. answer + tol (absolute tolerance), unit, prompt, work (worked solution)

  Text fields may contain simple HTML (<b>, <div class="rx-slip">).
*/
const CASES = [
  {
    id: "warfarin",
    answer: "Warfarin",
    clues: [
      ["Profile flag", "A patient's key lab value jumped from 2.5 to 4.8 one week after starting a course of sulfamethoxazole/trimethoprim for a UTI."],
      ["Interaction", "Other classic interaction alerts for this drug: fluconazole, metronidazole, and amiodarone. Its more potent S-enantiomer is cleared by CYP2C9."],
      ["Counseling", "Don't tell patients to avoid leafy greens. Tell them to keep their vitamin K intake consistent from week to week."],
      ["Dispensing", "Tablets are color-coded by strength: 1 mg pink, 2.5 mg green, 5 mg peach, 10 mg white."],
      ["Monitoring", "Dose is adjusted to an INR goal, usually 2.0–3.0 for atrial fibrillation or VTE."],
      ["Mechanism", "Vitamin K antagonist anticoagulant (brand: Coumadin/Jantoven). Reversed with vitamin K ± 4-factor PCC."]
    ],
    pearl: "Warfarin has a narrow therapeutic index and more interaction alerts than almost anything else on the shelf. SMX/TMP raises the INR two ways: it inhibits CYP2C9 and displaces warfarin from protein binding. Any new antibiotic, antifungal, or amiodarone start should prompt an INR check.",
    call: {
      scenario: `Mr. D, 71, takes warfarin 5 mg daily for atrial fibrillation. He started SMX/TMP DS five days ago. His anticoagulation-clinic INR today is <b>4.8</b>. He reports <b>no bleeding</b> and has 2 days of antibiotic left. The clinic nurse asks what you recommend.`,
      options: [
        "Give vitamin K 10 mg IV now and hold warfarin until the INR falls below 2, since an INR near 5 carries a high bleeding risk.",
        "Hold 1–2 warfarin doses, recheck the INR in a few days, and ask the prescriber whether a non-interacting antibiotic is an option.",
        "Keep the same warfarin dose and recheck the INR after the antibiotic ends, since the interaction fades once SMX/TMP is stopped.",
        "Stop warfarin and start apixaban 5 mg BID today, since DOACs have far fewer antibiotic interactions than warfarin does."
      ],
      correct: 1, slot: 2,
      why: "With an INR of 4.5–10 and no bleeding, guidance (CHEST) favors holding doses and rechecking rather than routinely giving vitamin K. IV vitamin K 10 mg is for major bleeding. Doing nothing leaves him supratherapeutic, and the effect can last after the antibiotic stops. A DOAC switch shouldn't start until the INR has dropped (for apixaban, below 2.0). For the next UTI, nitrofurantoin or a cephalosporin interacts less, but the INR still needs monitoring."
    },
    calc: {
      prompt: `Mr. D's INRs keep running high, so his prescriber reduces his <b>total weekly warfarin dose by 10%</b>. He currently takes 5 mg every day. What is his new total weekly dose?`,
      answer: 31.5, tol: 0.05, unit: "mg/week",
      work: `Current weekly dose: 5 mg × 7 days = 35 mg/week
10% reduction: 35 mg × 0.90 = 31.5 mg/week

Warfarin adjustments are made to the weekly total. The clinic then builds a daily schedule from available tablet strengths that adds up to about 31.5 mg.`
    }
  },
  {
    id: "lithium",
    answer: "Lithium",
    clues: [
      ["Profile flag", "A new hydrochlorothiazide Rx triggers a severe interaction alert with this patient's long-standing psychiatric medication."],
      ["Counseling", "Keep salt and fluid intake consistent. Dehydration, heavy sweating, or a sudden low-sodium diet can push levels up."],
      ["Interaction", "Patients should avoid OTC ibuprofen and naproxen. ACE inhibitors and ARBs need a closer look too."],
      ["Monitoring", "Trough levels are drawn about 12 hours after the last dose. A typical maintenance range is ~0.6–1.2 mEq/L."],
      ["Toxicity", "Watch for coarse tremor, vomiting/diarrhea, confusion, and ataxia. Long-term use can cause hypothyroidism and nephrogenic diabetes insipidus."],
      ["Mechanism", "A monovalent cation, cleared almost entirely by the kidneys. A first-line mood stabilizer for bipolar disorder."]
    ],
    pearl: "The kidneys handle lithium like sodium. When a thiazide, NSAID, or ACE inhibitor makes the kidney hold onto sodium, it holds onto lithium too, and serum levels can climb into the toxic range within days. For a drug with a therapeutic window this narrow, that's an emergency.",
    call: {
      scenario: `Ms. K, 44, has been stable on lithium carbonate ER 450 mg BID for years. She's at the counter asking which OTC product she can take for a week of <b>knee pain</b> after a fall. Her last level was 0.9 mEq/L. She has no liver disease.`,
      options: [
        "Ibuprofen 400 mg every 6 hours with food. A short course at OTC doses is acceptable as long as she stays well hydrated.",
        "Naproxen 220 mg twice daily. Its longer half-life means fewer doses, so total exposure is lower than with ibuprofen.",
        "Acetaminophen up to 3 g/day plus ice and rest. It doesn't change lithium clearance; see a provider if pain persists.",
        "Any OTC NSAID is fine for under a week, since the lithium interaction only builds up after weeks of daily use."
      ],
      correct: 2, slot: 0,
      why: "NSAIDs reduce renal lithium clearance and can raise levels substantially within days. That makes ibuprofen and naproxen poor choices, and the interaction is not just a long-term problem. Hydration helps but doesn't cancel the interaction. Acetaminophen doesn't affect lithium clearance, so it's the preferred OTC analgesic. If an NSAID is truly needed, the prescriber should know so they can recheck the lithium level."
    },
    calc: {
      prompt: `Ms. K takes lithium carbonate ER <b>450 mg BID</b>. Each <b>300 mg</b> of lithium carbonate provides <b>8.12 mEq</b> of lithium. How many mEq of lithium does she take per day? (Round to one decimal.)`,
      answer: 24.36, tol: 0.1, unit: "mEq/day",
      work: `Daily dose: 450 mg × 2 = 900 mg/day
900 mg × (8.12 mEq ÷ 300 mg) = 24.36 mEq/day ≈ 24.4 mEq

Why it matters: if she ever needs lithium citrate syrup (8 mEq per 5 mL), you'd convert by mEq, not mg: 24.36 ÷ 8 × 5 ≈ 15.2 mL/day.`
    }
  },
  {
    id: "methotrexate",
    answer: "Methotrexate",
    clues: [
      ["Rx check", "The directions say 'take daily,' but for this indication the drug is almost always dosed once weekly. Daily-instead-of-weekly errors have killed patients."],
      ["Counseling", "Usually paired with a daily B-vitamin supplement to cut down on mouth sores, GI upset, and liver enzyme bumps."],
      ["Interaction", "Sulfamethoxazole/trimethoprim and high-dose NSAIDs can raise levels and toxicity."],
      ["Monitoring", "Baseline and periodic CBC, liver function tests, and serum creatinine."],
      ["Safety", "Contraindicated in pregnancy (boxed warning). Patients should limit or avoid alcohol."],
      ["Mechanism", "Dihydrofolate reductase inhibitor (antimetabolite). Anchor DMARD for rheumatoid arthritis. Leucovorin is the rescue agent."]
    ],
    pearl: "Oral methotrexate is on ISMP's high-alert list mainly because of one error: weekly doses taken daily. Pharmacy systems should default to weekly for non-oncologic indications. Counsel patients to pick one specific day of the week and write it on the bottle.",
    call: {
      scenario: `A new e-Rx arrives for a 58-year-old with rheumatoid arthritis:<div class="rx-slip">Methotrexate 2.5 mg tablets
Sig: Take 3 tablets (7.5 mg) by mouth daily
Disp: #90   Refills: 2
Dx: M06.9 Rheumatoid arthritis</div>`,
      options: [
        "Dispense as written. Daily low-dose regimens are occasionally used, and the prescriber has the full clinical picture.",
        "Correct the sig to 'once weekly' since that's clearly the intent, then document the change and counsel the patient.",
        "Hold the Rx and call the prescriber to clarify the frequency (likely weekly), and confirm folic acid is prescribed.",
        "Dispense a 7-day supply so therapy isn't delayed, and fax the prescriber to confirm frequency before the next fill."
      ],
      correct: 2, slot: 3,
      why: "Daily methotrexate at RA doses can cause fatal bone marrow suppression, mucositis, and hepatotoxicity, so this Rx can't go out as written. Even a 7-day supply exposes the patient to a week of daily dosing. The pharmacist also shouldn't change the frequency without the prescriber's authorization. Call, clarify, and document. While you're on the phone, confirm folic acid and recent CBC/LFT/SCr results. A #90 quantity is also unusually large for weekly RA dosing, which is another reason to call."
    },
    calc: {
      prompt: `The prescriber confirms <b>7.5 mg once weekly</b> and changes the quantity to <b>#12 tablets</b> (2.5 mg each). What days supply do you enter on the claim?`,
      answer: 28, tol: 0, unit: "days",
      work: `Tablets per week: 7.5 mg ÷ 2.5 mg = 3 tablets
Weeks supplied: 12 ÷ 3 = 4 weeks
Days supply: 4 × 7 = 28 days

Entering "4 days" (as if daily) is a common billing error, and it's one more place a daily/weekly mix-up shows up.`
    }
  },
  {
    id: "simvastatin",
    answer: "Simvastatin",
    clues: [
      ["Profile flag", "You enter a clarithromycin Rx for community-acquired pneumonia and get a hard-stop contraindication alert with this patient's maintenance med."],
      ["Counseling", "Report unexplained muscle pain, tenderness, or weakness right away, especially with fever or dark urine."],
      ["Dispensing", "Its short half-life is why labeling has long suggested evening dosing, unlike some longer-acting siblings in its class."],
      ["Safety", "The highest dose (80 mg) is restricted to patients who've already tolerated it for 12+ months because of myopathy risk."],
      ["Interaction", "Dose caps: 10 mg/day with diltiazem or verapamil, 20 mg/day with amlodipine or amiodarone."],
      ["Mechanism", "HMG-CoA reductase inhibitor, heavily dependent on CYP3A4 (brand: Zocor)."]
    ],
    pearl: "Simvastatin and lovastatin depend heavily on CYP3A4. Strong inhibitors (clarithromycin, itraconazole, ketoconazole, HIV protease inhibitors) can multiply exposure many-fold, which raises the risk of rhabdomyolysis. Rosuvastatin and pravastatin are much less affected by CYP3A4 and are the usual alternatives.",
    call: {
      scenario: `Mr. T, 66, takes <b>simvastatin 40 mg nightly</b> and amlodipine 10 mg daily. An urgent care e-Rx arrives: <b>clarithromycin 500 mg BID × 7 days</b> for community-acquired pneumonia. No macrolide allergy. The urgent care is still open.`,
      options: [
        "Dispense both and counsel him to stop the simvastatin on his own if he notices muscle pain during the antibiotic course.",
        "Lower his simvastatin to 20 mg for the week on your own authority, then dispense the clarithromycin as written.",
        "Call the prescriber: suggest azithromycin or doxycycline if appropriate, or holding simvastatin during the course.",
        "Swap simvastatin for lovastatin 40 mg for the week, since a different statin sidesteps the clarithromycin interaction."
      ],
      correct: 2, slot: 1,
      why: "Clarithromycin is a strong CYP3A4 inhibitor, and its labeling contraindicates use with simvastatin. Counseling alone doesn't fix a contraindication, and a pharmacist can't change his maintenance dose on their own. Lovastatin has the same CYP3A4 problem. Azithromycin barely inhibits CYP3A4. Temporarily holding the statin is low-risk for a short antibiotic course. Note too that his current 40 mg dose already exceeds the 20 mg cap with amlodipine, so flag that for his PCP while you're at it."
    },
    calc: {
      prompt: `While you're reviewing renal function for the antibiotic: Mr. T is <b>66 years old</b>, weighs <b>80 kg</b> (close to his ideal weight), and his serum creatinine is <b>1.6 mg/dL</b>. Using Cockcroft-Gault, what is his estimated CrCl? (Round to the nearest whole number.)`,
      answer: 51.4, tol: 1, unit: "mL/min",
      work: `CrCl = [(140 − age) × weight] ÷ (72 × SCr)    (male, so no × 0.85)
     = [(140 − 66) × 80] ÷ (72 × 1.6)
     = (74 × 80) ÷ 115.2
     = 5,920 ÷ 115.2 ≈ 51 mL/min

Clarithromycin is reduced 50% only when CrCl is below 30 mL/min, so no renal adjustment is needed here.`
    }
  },
  {
    id: "levothyroxine",
    answer: "Levothyroxine",
    clues: [
      ["Counseling", "Separate this drug from calcium, iron, and antacids by at least 4 hours."],
      ["Dispensing", "Narrow therapeutic index. Strengths follow a standard color code: 50 mcg white, 100 mcg yellow, 150 mcg blue."],
      ["Counseling", "Take it on an empty stomach with water, 30–60 minutes before breakfast, at the same time every day."],
      ["Monitoring", "Recheck TSH about 6–8 weeks after any dose change or brand/generic switch."],
      ["Safety", "Boxed warning: not for the treatment of obesity or for weight loss."],
      ["Mechanism", "Synthetic T4 (brands: Synthroid, Levoxyl, Unithroid)."]
    ],
    pearl: "Absorption problems are among the most common reasons for a 'rising TSH despite adherence.' Coffee, calcium, iron, PPIs, soy, and taking it with food can all reduce absorption. Before anyone raises the dose, a pharmacist should ask how and when it's being taken.",
    call: {
      scenario: `Mrs. R, 62, picks up levothyroxine 100 mcg. She mentions her TSH was "a little high" again. On questioning, she takes it <b>with breakfast and coffee</b>, together with her <b>calcium carbonate + vitamin D</b> tablet, "so I don't forget." She reports taking every dose.`,
      options: [
        "Suggest she ask her doctor to raise the dose to 112 mcg, since her TSH is high even though she takes every dose.",
        "Have her take it alone with water 30–60 minutes before breakfast, move calcium 4+ hours away, and inform the prescriber.",
        "Recommend switching to liothyronine, since T3 is absorbed more reliably and is less affected by food or calcium.",
        "Tell her to stop the calcium supplement entirely so it can't interfere, and keep taking levothyroxine with breakfast."
      ],
      correct: 1, slot: 0,
      why: "Taking it with food, coffee, and calcium carbonate can substantially reduce levothyroxine absorption, so fix the administration before anyone raises the dose. A dose increase now could leave her over-replaced once she starts taking it correctly. Liothyronine (T3) isn't a fix for an absorption problem. She may still need the calcium for bone health, and breakfast and coffee still interfere, so separate rather than stop. Loop in the prescriber so the follow-up TSH is read with the new routine in mind."
    },
    calc: {
      prompt: `Months later, Mrs. R is admitted and made NPO. The team converts her oral levothyroxine <b>100 mcg daily</b> to IV using <b>75% of the oral dose</b>. What IV dose should be ordered?`,
      answer: 75, tol: 0, unit: "mcg",
      work: `100 mcg × 0.75 = 75 mcg IV daily

IV levothyroxine is roughly 50–75% of the oral dose because oral absorption is incomplete. Follow your institution's conversion policy.`
    }
  },
  {
    id: "fentanyl",
    answer: "Fentanyl",
    clues: [
      ["Profile flag", "A surgeon sends a new Rx for a patient discharged after knee replacement. The PDMP shows no opioid fills in the past 12 months."],
      ["Dispensing", "Schedule II: no refills, and the prescriber must be registered with the DEA for this schedule."],
      ["Counseling", "Heating pads, electric blankets, hot tubs, and fever can increase absorption from this dosage form, sometimes dangerously."],
      ["Dispensing", "The usual sig is 'apply 1 every 72 hours.' Some patients need every 48."],
      ["Disposal", "Fold used units in half with the sticky sides together, then flush. It's on the FDA flush list."],
      ["Mechanism", "Synthetic opioid agonist roughly 50–100× more potent than morphine, given here as a transdermal patch (brand: Duragesic)."]
    ],
    pearl: "Fentanyl patches are only for opioid-tolerant patients: those taking at least 60 mg oral morphine equivalents per day (or equivalent) for a week or longer. They take 12–24 hours to reach steady effect and keep working long after removal, which makes them dangerous for acute or post-op pain in opioid-naïve patients.",
    call: {
      scenario: `A new Rx arrives:<div class="rx-slip">Fentanyl 25 mcg/h transdermal patch
Sig: Apply 1 patch every 72 hours for post-op pain
Disp: #5
Pt: 54 y/o, s/p total knee arthroplasty yesterday</div>The PDMP shows <b>no opioid prescriptions in the last year</b>. The patient says they "don't usually take pain pills."`,
      options: [
        "Dispense it and counsel thoroughly on heat exposure, the 72-hour change schedule, and fold-and-flush disposal.",
        "Dispense the 12 mcg/h strength instead, since starting at the lowest patch strength reduces the overdose risk.",
        "Don't dispense yet. Call the prescriber: patches are contraindicated for opioid-naïve patients and acute pain.",
        "Dispense it with a naloxone co-prescription and overdose counseling, which mitigates the respiratory risk."
      ],
      correct: 2, slot: 2,
      why: "The boxed warning and labeling restrict fentanyl patches to opioid-tolerant patients with chronic pain. Using one in an opioid-naïve patient for acute pain risks fatal respiratory depression, and good counseling can't make an inappropriate drug safe. Switching strengths without authorization isn't the pharmacist's call, and 12 mcg/h is still inappropriate here. Naloxone is a good addition to any opioid Rx, but it doesn't make a contraindicated therapy acceptable. This is a corresponding-responsibility moment: call, document, and propose an alternative such as a short course of an immediate-release opioid plus a multimodal regimen."
    },
    calc: {
      prompt: `A different patient is being evaluated for a fentanyl patch. They take <b>oxycodone IR 10 mg every 6 hours</b> around the clock and have for 3 weeks. Oxycodone's MME conversion factor is <b>1.5</b>. What is their daily morphine milligram equivalent (MME)?`,
      answer: 60, tol: 0, unit: "MME/day",
      work: `Daily oxycodone: 10 mg × 4 doses = 40 mg/day
MME: 40 mg × 1.5 = 60 MME/day

60 MME/day for at least a week is exactly the opioid-tolerance threshold in fentanyl patch labeling (equivalent to oxycodone 30 mg/day or more), so this patient qualifies. The patient in Round 2 had 0.`
    }
  },
  {
    id: "isotretinoin",
    answer: "Isotretinoin",
    clues: [
      ["Dispensing", "Each fill is limited to a 30-day supply with no refills, and the pharmacy must get authorization from a REMS system before it can be dispensed."],
      ["Counseling", "Patients who can get pregnant must use two forms of contraception and have a negative pregnancy test before every fill."],
      ["Counseling", "No blood donation during therapy and for 1 month after the last dose."],
      ["Interaction", "Avoid tetracyclines like doxycycline and minocycline with it: the combination raises the risk of pseudotumor cerebri. Avoid vitamin A supplements too."],
      ["Safety", "Watch for mood changes and depression, plus severe dry lips, skin, and eyes."],
      ["Mechanism", "Oral retinoid for severe nodular acne, dispensed under the iPLEDGE REMS (brands: Absorica, Claravis, Amnesteem)."]
    ],
    pearl: "Isotretinoin is one of the most teratogenic drugs dispensed in community pharmacy. iPLEDGE exists so that every single fill, not just the first, is tied to a confirmed negative pregnancy test, counseling, and contraception. That's why it's 30 days at a time, with no refills and no exceptions.",
    call: {
      scenario: `A 22-year-old patient who can get pregnant is picking up month 3 of isotretinoin. All iPLEDGE requirements are met for this fill. She asks if you can give her a <b>90-day supply</b> because she's leaving for a <b>3-month study-abroad program</b> next week.`,
      options: [
        "Dispense 90 days, since she's had several negative tests and the REMS mainly targets the first months of therapy.",
        "Dispense 30 days today and enter the other 60 days as two refills that she can pick up early before her flight.",
        "Explain that iPLEDGE limits each fill to 30 days with no refills, and she should plan around the trip with her prescriber.",
        "Call the prescriber to request a 90-day travel override from iPLEDGE, which is allowed for documented travel."
      ],
      correct: 2, slot: 1,
      why: "Under iPLEDGE, every fill is capped at a 30-day supply, refills aren't allowed, and each fill needs a new authorization tied to a negative pregnancy test. There's no travel override, and 'early refills' are just refills by another name. The right move is to dispense this month's 30 days and help her and the prescriber plan: pausing therapy, timing the course around the trip, or setting up care abroad."
    },
    calc: {
      prompt: `Her dermatologist is aiming for a <b>cumulative dose of 120 mg/kg</b>. She weighs <b>68 kg</b> and takes <b>68 mg/day</b> (1 mg/kg/day). How many days of therapy will it take to reach the target?`,
      answer: 120, tol: 0, unit: "days",
      work: `Target cumulative dose: 120 mg/kg × 68 kg = 8,160 mg
Days to reach target: 8,160 mg ÷ 68 mg/day = 120 days

That's about four 30-day iPLEDGE fills. Commonly cited cumulative targets are 120–150 mg/kg.`
    }
  },
  {
    id: "digoxin",
    answer: "Digoxin",
    clues: [
      ["Profile flag", "A new amiodarone Rx triggers an alert: amiodarone can roughly double serum levels of this patient's long-standing heart medication."],
      ["Monitoring", "Low potassium or magnesium raises toxicity risk even when the serum level looks normal. Check electrolytes when a new diuretic starts."],
      ["Toxicity", "Early toxicity looks like nausea, anorexia, and confusion. Visual changes include blurred vision and yellow-green halos."],
      ["Monitoring", "Target serum level in heart failure is about 0.5–0.9 ng/mL, drawn at least 6 hours after a dose."],
      ["Dispensing", "Mostly renally cleared, so doses are lower in older adults and CKD. Common tablet strengths are 125 and 250 mcg."],
      ["Mechanism", "Cardiac glycoside that inhibits Na+/K+-ATPase (brand: Lanoxin). Reversal: digoxin immune fab (DigiFab)."]
    ],
    pearl: "Digoxin has a narrow window, and its toxicity is often subtle in older adults: loss of appetite, confusion, fatigue. Amiodarone, verapamil, and some macrolides raise levels through P-gp inhibition, while hypokalemia from diuretics makes the heart more sensitive at any level.",
    call: {
      scenario: `Mrs. P, 78, takes <b>digoxin 125 mcg daily</b> for heart failure with atrial fibrillation. Her cardiologist sends a new Rx for <b>amiodarone 200 mg daily</b> (after a loading course in the hospital). Her last digoxin level was 0.8 ng/mL and her renal function is stable.`,
      options: [
        "Dispense amiodarone as written. Its effect on digoxin builds over months, so the dose can be adjusted at her next visit.",
        "Contact the prescriber: recommend reducing digoxin by about 30–50% and rechecking a level and potassium in 1–2 weeks.",
        "Tell her to stop digoxin on her own until amiodarone is finished, without involving the prescriber, to avoid toxicity.",
        "Dispense both and counsel on toxicity signs; a digoxin level is only needed if she develops nausea or vision changes."
      ],
      correct: 1, slot: 3,
      why: "Amiodarone inhibits P-gp and raises digoxin concentrations, and the effect is clinically meaningful within days to weeks, not months. Labeling recommends reducing digoxin (by about 30–50%, or less frequent dosing) when amiodarone starts, then monitoring levels. Waiting for symptoms is risky in an older adult whose toxicity may present only as confusion or poor appetite. Telling her to stop on her own bypasses the prescriber, and amiodarone is usually long-term anyway."
    },
    calc: {
      prompt: `The cardiologist reduces Mrs. P's digoxin to <b>62.5 mcg daily</b> and switches her to the <b>oral solution, 0.05 mg/mL</b>, so she can measure the smaller dose. How many mL should she take per dose?`,
      answer: 1.25, tol: 0.01, unit: "mL",
      work: `Convert units first: 0.05 mg/mL = 50 mcg/mL
62.5 mcg ÷ 50 mcg/mL = 1.25 mL

Dispense with the calibrated dropper or oral syringe and show her the 1.25 mL mark. A mg-vs-mcg slip here would be a tenfold error or worse.`
    }
  },
  {
    id: "metformin",
    answer: "Metformin",
    clues: [
      ["Counseling", "Take with meals to reduce GI upset. The extended-release form is often better tolerated, and its empty tablet shell may show up in the stool."],
      ["Monitoring", "Check vitamin B12 periodically. Long-term use can lower it and contribute to neuropathy."],
      ["Rx check", "Hold it before iodinated contrast in some patients, and restart only once renal function is confirmed stable."],
      ["Safety", "Boxed warning for lactic acidosis. Risk rises with kidney impairment, hypoxia, and heavy alcohol use."],
      ["Rx check", "Contraindicated if eGFR is below 30 mL/min/1.73m². Don't start it if eGFR is 30–45."],
      ["Mechanism", "Biguanide that decreases hepatic glucose production. First-line oral therapy for type 2 diabetes."]
    ],
    pearl: "Metformin isn't nephrotoxic. The concern is that it's cleared by the kidneys, so when kidney function falls, it accumulates and lactic acidosis becomes possible. Pharmacists catch this by actually looking at the labs that come through, not just the refill history.",
    call: {
      scenario: `Mrs. G, 74, is due for a refill of <b>metformin ER 1,000 mg twice daily</b>. Lab results from her clinic, faxed yesterday, show her <b>eGFR has dropped from 48 to 27</b> over the past year. She feels fine and her A1c is 7.1%.`,
      options: [
        "Refill as usual. One low eGFR is often a lab fluke, so wait for a confirmatory value before involving the prescriber.",
        "Refill at half the dose (500 mg twice daily) on your own, since dose reduction is the standard step below eGFR 30.",
        "Contact the prescriber before refilling: metformin is contraindicated below eGFR 30 and should be discontinued.",
        "Refill and counsel her to increase her water intake, which usually brings eGFR back above 30 within a few weeks."
      ],
      correct: 2, slot: 3,
      why: "Below an eGFR of 30, metformin is contraindicated and should be stopped, not reduced. The trend here (48 to 27 over a year) isn't a one-off fluke, and in any case the prescriber needs to know before another month is dispensed. Dose reduction is a consideration in the 30–45 range, and it's still the prescriber's call. Hydration doesn't reverse chronic kidney decline. The prescriber may consider alternatives like a DPP-4 inhibitor (renally dosed) or a GLP-1 RA."
    },
    calc: {
      prompt: `Before the eGFR drop, Mrs. G's prescription read: <b>metformin ER 500 mg tablets, take 4 tablets (2,000 mg) once daily with the evening meal, #120</b>. What days supply would you have entered?`,
      answer: 30, tol: 0, unit: "days",
      work: `Tablets per day: 2,000 mg ÷ 500 mg = 4 tablets
Days supply: 120 tablets ÷ 4 tablets/day = 30 days`
    }
  },
  {
    id: "nitroglycerin",
    answer: "Nitroglycerin",
    clues: [
      ["Counseling", "Keep it in the original glass bottle, tightly capped, away from heat and moisture. Don't add a cotton ball or mix in other pills."],
      ["Counseling", "Sit down before taking a dose. Headache, flushing, and dizziness are common and expected."],
      ["Interaction", "Contraindicated with sildenafil, tadalafil, and vardenafil because of severe, potentially fatal hypotension."],
      ["Dispensing", "Sig: 1 tablet under the tongue every 5 minutes as needed for chest pain, up to 3 doses."],
      ["Counseling", "If chest pain isn't better 5 minutes after the first dose, call 911."],
      ["Mechanism", "Nitrate vasodilator for acute angina, available as 0.4 mg sublingual tablets or spray (brand: Nitrostat)."]
    ],
    pearl: "Nitrates plus PDE5 inhibitors cause additive cGMP-driven vasodilation that can drop blood pressure dramatically. With sildenafil, nitrates should be avoided for at least 24 hours; with tadalafil, at least 48. For patients on a daily nitrate, PDE5 inhibitors are simply contraindicated.",
    call: {
      scenario: `Mr. J, 63, brings in a new Rx for <b>sildenafil 50 mg, take 1 tablet 1 hour before sexual activity</b>, from a urologist. His profile shows <b>isosorbide mononitrate ER 30 mg daily</b> and nitroglycerin SL as needed, both from his cardiologist.`,
      options: [
        "Dispense and counsel him to wait at least 24 hours after sildenafil before taking nitroglycerin for chest pain.",
        "Dispense the 25 mg strength instead, which keeps the blood pressure drop with daily nitrates in a safe range.",
        "Hold the Rx and call the urologist: PDE5 inhibitors are contraindicated with daily nitrates like isosorbide.",
        "Dispense and advise him to skip his isosorbide mononitrate dose on any day he plans to take the sildenafil."
      ],
      correct: 2, slot: 1,
      why: "The 24-hour spacing rule is for patients who use nitroglycerin only occasionally. Mr. J takes a long-acting nitrate every day, so there's no safe window, and a lower sildenafil dose doesn't remove the risk. Skipping a dose of a long-acting nitrate doesn't clear it from the body, and stopping antianginal therapy on his own carries its own risk. Call the urologist (and ideally loop in the cardiologist) so they can coordinate a safe plan."
    },
    calc: {
      prompt: `In the hospital, a patient is on a nitroglycerin drip: <b>50 mg in 250 mL</b> D5W. The order is to start at <b>10 mcg/min</b>. What rate do you set on the pump?`,
      answer: 3, tol: 0.05, unit: "mL/h",
      work: `Concentration: 50 mg ÷ 250 mL = 0.2 mg/mL = 200 mcg/mL
Dose per hour: 10 mcg/min × 60 min = 600 mcg/h
Rate: 600 mcg/h ÷ 200 mcg/mL = 3 mL/h`
    }
  },
  {
    id: "vancomycin",
    answer: "Vancomycin",
    clues: [
      ["Safety", "Infusing it too fast causes flushing and itching of the face, neck, and upper body. It's an infusion reaction, not a true allergy."],
      ["Interaction", "The risk of kidney injury goes up when it's combined with piperacillin/tazobactam, aminoglycosides, or loop diuretics."],
      ["Dispensing", "The oral capsules are barely absorbed, which is exactly why they work for C. difficile infection."],
      ["Monitoring", "Guidelines target an AUC of 400–600 mg·h/L for serious MRSA infections, rather than relying on troughs alone."],
      ["Dosing", "Loading doses of 20–35 mg/kg based on actual body weight for critically ill patients."],
      ["Mechanism", "Glycopeptide that binds D-Ala-D-Ala in the bacterial cell wall. The IV workhorse for MRSA."]
    ],
    pearl: "Pharmacist-to-dose vancomycin protocols are one of the most common clinical services in hospital pharmacy. The infusion reaction (formerly 'red man syndrome') is rate-related histamine release. The fix is usually to slow the infusion, not to label the patient allergic and lose a key MRSA drug.",
    call: {
      scenario: `A nurse calls the pharmacy: a patient receiving <b>vancomycin 1,500 mg IV over 60 minutes</b> developed <b>flushing and itching on the face, neck, and chest</b> about 20 minutes into the infusion. Blood pressure is stable, and there's no wheezing, lip swelling, or hives.`,
      options: [
        "Stop vancomycin permanently, record a severe vancomycin allergy, and recommend switching therapy to daptomycin.",
        "Pause the infusion, give an antihistamine if needed, then resume at a slower rate (e.g., over 2 hours) going forward.",
        "Continue at the same rate, since this reaction is expected with vancomycin and resolves after the first few doses.",
        "Continue at the same rate, but premedicate with epinephrine before each future dose to prevent the flushing."
      ],
      correct: 1, slot: 0,
      why: "This is a vancomycin infusion reaction: rate-related histamine release, not an IgE-mediated allergy. 1,500 mg over 60 minutes exceeds the usual maximum rate of about 1 g/hour. Pause, treat symptoms with an antihistamine if needed, and resume more slowly. Future doses can be given over a longer time, sometimes with antihistamine premedication. Labeling it a severe allergy can needlessly cost the patient a first-line MRSA drug. Epinephrine is for anaphylaxis, not routine premedication."
    },
    calc: {
      prompt: `You're dosing vancomycin for a septic patient weighing <b>88 kg</b>. Your protocol calls for a <b>loading dose of 25 mg/kg</b> (actual body weight). What is the calculated loading dose before rounding?`,
      answer: 2200, tol: 0, unit: "mg",
      work: `25 mg/kg × 88 kg = 2,200 mg

Many protocols then round to the nearest 250 mg (2,250 mg) and cap the loading dose (often at 3,000 mg). At ≤1 g/hour, this dose runs over at least 2.25 hours.`
    }
  },
  {
    id: "glargine",
    answer: "Insulin glargine",
    clues: [
      ["Dispensing", "Once a pen is in use, it's good at room temperature for 28 days, then must be discarded even if some is left."],
      ["Counseling", "Never mix it with another insulin in the same syringe, because it can change how the drug is absorbed."],
      ["Counseling", "With a pen, prime 2 units before each injection to make sure the needle is working."],
      ["Monitoring", "Titrated to fasting blood glucose, often by 2 units every 3 days until the patient is at goal."],
      ["Dosing", "Usually started at 10 units/day or 0.1–0.2 units/kg/day, given once daily at the same time each day."],
      ["Mechanism", "Long-acting basal insulin analog with no pronounced peak (brands: Lantus, Basaglar, Semglee)."]
    ],
    pearl: "Insulin is an ISMP high-alert medication, and pharmacists handle it constantly: days-supply math, pen storage and expiration, hypoglycemia counseling, and catching unit confusion. Priming doses and the 28-day discard rule both affect how long a box really lasts.",
    call: {
      scenario: `Mrs. W, 69, uses <b>insulin glargine 30 units daily plus glipizide</b>. At pickup she looks pale and shaky and says she skipped lunch. Her meter, checked at the counter, reads <b>58 mg/dL</b>. She's alert, talking normally, and can swallow.`,
      options: [
        "Have her eat a full meal with protein right away, since protein raises blood sugar slowly but keeps it up longer.",
        "Give 15–20 g of fast-acting glucose (e.g., 4 glucose tablets), recheck in 15 minutes, and repeat if still under 70.",
        "Call 911 right away and keep her from eating or drinking, since anything by mouth could be risky before EMS arrives.",
        "Give a glucagon injection from pharmacy stock, since glucagon is first-line for any glucose reading below 70."
      ],
      correct: 1, slot: 2,
      why: "For a conscious patient who can swallow, the 'rule of 15' applies: 15–20 g of fast-acting carbohydrate, recheck in 15 minutes, repeat as needed, then a snack or meal once she's above 70. Protein doesn't raise glucose quickly enough. Glucagon and EMS are for patients who are unconscious or can't safely swallow. Because she's on a sulfonylurea, hypoglycemia can recur, so she should be monitored and her prescriber told."
    },
    calc: {
      prompt: `A patient is prescribed <b>insulin glargine 40 units once daily</b>. They prime <b>2 units</b> before each injection. You dispense <b>1 box of 5 pens</b> (each 3 mL of U-100). What days supply do you enter? (Round down to whole days.)`,
      answer: 35, tol: 0.75, unit: "days",
      work: `Total units: 5 pens × 3 mL × 100 units/mL = 1,500 units
Daily use: 40 units + 2 units priming = 42 units/day
Days supply: 1,500 ÷ 42 = 35.7 → 35 days

Check expiration too: each pen holds 300 units ÷ 42 = about 7 days of use, well within the 28-day in-use limit.`
    }
  },
  {
    id: "amoxicillin",
    answer: "Amoxicillin",
    clues: [
      ["Dispensing", "The pharmacy reconstitutes the suspension with water in two portions, shaking after each, and labels it 'discard after 14 days.'"],
      ["Counseling", "Refrigeration improves the taste but isn't required. Finish the full course even if your child feels better."],
      ["Safety", "A flat, non-itchy rash can show up days into therapy, especially in patients with mono (EBV). That's not the same as a true allergy."],
      ["Rx check", "Always ask about previous reactions. Hives or swelling within an hour of a dose suggests a true IgE-mediated allergy."],
      ["Dosing", "High-dose 80–90 mg/kg/day divided twice daily is standard for acute otitis media in children."],
      ["Mechanism", "Aminopenicillin. First-line for acute otitis media and strep throat."]
    ],
    pearl: "Pediatric antibiotics are where pharmacists most often catch dosing errors: wrong weight, mg vs mL, or the wrong suspension concentration. A good allergy history at drop-off ('what happened, and how soon?') separates true IgE reactions from benign rashes and GI upset.",
    call: {
      scenario: `A parent drops off a new Rx for <b>amoxicillin suspension</b> for their 3-year-old with an ear infection. The profile lists no allergies. When you ask, the parent says that last year the child got <b>hives and lip swelling within about 30 minutes</b> of the first dose of amoxicillin.`,
      options: [
        "Dispense, since most amoxicillin rashes in children aren't allergic, and tell the parent to watch closely for hives.",
        "Hold the Rx, add the allergy to the profile, and call the prescriber to discuss a non-penicillin alternative.",
        "Dispense amoxicillin/clavulanate instead, since clavulanate is the component that usually causes the reaction.",
        "Dispense with diphenhydramine 30 minutes before each dose to keep the hives and swelling from coming back."
      ],
      correct: 1, slot: 1,
      why: "Hives plus lip swelling within an hour of a dose is a classic IgE-mediated reaction, and re-exposure could cause anaphylaxis. The benign delayed rash is a different story, but this history isn't that. Clavulanate doesn't remove the penicillin, and premedication doesn't make a true allergy safe. Document the allergy (it was missing from the profile) and contact the prescriber for an alternative. Down the line, a referral for allergy evaluation can clarify it."
    },
    calc: {
      prompt: `A different child weighing <b>22 kg</b> is prescribed amoxicillin <b>90 mg/kg/day divided twice daily</b>, using <b>400 mg/5 mL</b> suspension. How many mL per dose? (Round to one decimal.)`,
      answer: 12.375, tol: 0.06, unit: "mL",
      work: `Daily dose: 90 mg/kg × 22 kg = 1,980 mg/day
Per dose (BID): 1,980 ÷ 2 = 990 mg
Concentration: 400 mg ÷ 5 mL = 80 mg/mL
Volume: 990 ÷ 80 = 12.375 ≈ 12.4 mL per dose

Many pharmacies round to a measurable volume (e.g., 12.5 mL) if the prescriber agrees.`
    }
  },
  {
    id: "clopidogrel",
    answer: "Clopidogrel",
    clues: [
      ["Profile flag", "A new omeprazole Rx triggers an interaction alert: it can reduce activation of this patient's cardiac medication."],
      ["Interaction", "A prodrug that needs CYP2C19 for activation. Boxed warning: poor metabolizers get less benefit."],
      ["Counseling", "Don't stop it early without talking to the cardiologist. Stopping soon after a stent raises the risk of stent thrombosis."],
      ["Safety", "Usually held about 5 days before elective surgery, but only if the cardiologist agrees."],
      ["Dispensing", "A common post-stent regimen: 600 mg loading dose, then 75 mg daily, alongside low-dose aspirin."],
      ["Mechanism", "P2Y12 inhibitor antiplatelet (brand: Plavix)."]
    ],
    pearl: "Clopidogrel is a prodrug, so anything that blocks its activating enzyme blunts its effect. Omeprazole and esomeprazole inhibit CYP2C19; pantoprazole does much less. FDA labeling advises avoiding omeprazole and esomeprazole with clopidogrel.",
    call: {
      scenario: `Mr. B, 59, had a <b>drug-eluting stent placed 2 months ago</b> and takes clopidogrel 75 mg daily plus aspirin 81 mg. His PCP sends a new Rx for <b>omeprazole 20 mg daily</b> for GI protection on dual antiplatelet therapy.`,
      options: [
        "Dispense omeprazole and have him take it 12 hours apart from clopidogrel, which avoids the CYP2C19 interaction.",
        "Call the PCP to suggest pantoprazole instead, since it has much less CYP2C19 interaction than omeprazole does.",
        "Dispense omeprazole and suggest the cardiologist switch him to aspirin alone, which doesn't interact with PPIs.",
        "Dispense esomeprazole instead of omeprazole, since the S-isomer doesn't inhibit CYP2C19 the way omeprazole does."
      ],
      correct: 1, slot: 3,
      why: "GI protection on dual antiplatelet therapy is reasonable, so the goal is to keep a PPI without blunting clopidogrel. Labeling advises avoiding omeprazole and esomeprazole (esomeprazole is the S-isomer of omeprazole and also inhibits CYP2C19). Spacing doses apart doesn't prevent the interaction. Pantoprazole is the usual swap. Dropping to aspirin alone 2 months after a drug-eluting stent would raise his risk of stent thrombosis and isn't a PPI-interaction fix."
    },
    calc: {
      prompt: `A new post-stent Rx reads: <b>clopidogrel 75 mg tablets, take 8 tablets (600 mg) on day 1, then 1 tablet daily</b>. How many tablets do you dispense for a <b>30-day supply</b>?`,
      answer: 37, tol: 0, unit: "tablets",
      work: `Day 1: 8 tablets
Days 2–30: 29 days × 1 tablet = 29 tablets
Total: 8 + 29 = 37 tablets

A common miss is dispensing 30 + 8 = 38. Day 1's loading dose replaces that day's maintenance dose.`
    }
  }
];
