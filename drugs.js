// Guessable drug list used for Round 1 autocomplete and color feedback.
// Format: [name, drug class, therapeutic area]
const DRUGS = [
  ["Warfarin","Anticoagulant","Hematology"],["Apixaban","Anticoagulant","Hematology"],["Rivaroxaban","Anticoagulant","Hematology"],
  ["Dabigatran","Anticoagulant","Hematology"],["Enoxaparin","Anticoagulant","Hematology"],["Heparin","Anticoagulant","Hematology"],
  ["Clopidogrel","Antiplatelet","Hematology"],["Aspirin","Antiplatelet","Hematology"],["Ticagrelor","Antiplatelet","Hematology"],["Prasugrel","Antiplatelet","Hematology"],

  ["Atorvastatin","Statin","Cardiovascular"],["Simvastatin","Statin","Cardiovascular"],["Rosuvastatin","Statin","Cardiovascular"],
  ["Pravastatin","Statin","Cardiovascular"],["Lovastatin","Statin","Cardiovascular"],["Ezetimibe","Cholesterol absorption inhibitor","Cardiovascular"],
  ["Lisinopril","ACE inhibitor","Cardiovascular"],["Enalapril","ACE inhibitor","Cardiovascular"],["Ramipril","ACE inhibitor","Cardiovascular"],["Benazepril","ACE inhibitor","Cardiovascular"],
  ["Losartan","ARB","Cardiovascular"],["Valsartan","ARB","Cardiovascular"],["Olmesartan","ARB","Cardiovascular"],
  ["Metoprolol","Beta blocker","Cardiovascular"],["Carvedilol","Beta blocker","Cardiovascular"],["Atenolol","Beta blocker","Cardiovascular"],["Propranolol","Beta blocker","Cardiovascular"],
  ["Amlodipine","Calcium channel blocker","Cardiovascular"],["Diltiazem","Calcium channel blocker","Cardiovascular"],["Verapamil","Calcium channel blocker","Cardiovascular"],["Nifedipine","Calcium channel blocker","Cardiovascular"],
  ["Hydrochlorothiazide","Diuretic","Cardiovascular"],["Chlorthalidone","Diuretic","Cardiovascular"],["Furosemide","Diuretic","Cardiovascular"],["Spironolactone","Diuretic","Cardiovascular"],
  ["Amiodarone","Antiarrhythmic","Cardiovascular"],["Sotalol","Antiarrhythmic","Cardiovascular"],["Digoxin","Cardiac glycoside","Cardiovascular"],
  ["Nitroglycerin","Nitrate","Cardiovascular"],["Isosorbide mononitrate","Nitrate","Cardiovascular"],["Isosorbide dinitrate","Nitrate","Cardiovascular"],
  ["Hydralazine","Vasodilator","Cardiovascular"],["Sacubitril/valsartan","ARNI","Cardiovascular"],

  ["Levothyroxine","Thyroid hormone","Endocrine"],["Liothyronine","Thyroid hormone","Endocrine"],["Methimazole","Antithyroid","Endocrine"],["Propylthiouracil","Antithyroid","Endocrine"],
  ["Metformin","Antidiabetic","Endocrine"],["Glipizide","Antidiabetic","Endocrine"],["Glyburide","Antidiabetic","Endocrine"],["Insulin glargine","Antidiabetic","Endocrine"],
  ["Insulin detemir","Antidiabetic","Endocrine"],["Insulin lispro","Antidiabetic","Endocrine"],["Insulin aspart","Antidiabetic","Endocrine"],["Regular insulin","Antidiabetic","Endocrine"],
  ["Sitagliptin","Antidiabetic","Endocrine"],["Empagliflozin","Antidiabetic","Endocrine"],["Dapagliflozin","Antidiabetic","Endocrine"],["Semaglutide","Antidiabetic","Endocrine"],
  ["Tirzepatide","Antidiabetic","Endocrine"],["Pioglitazone","Antidiabetic","Endocrine"],
  ["Alendronate","Bisphosphonate","Endocrine"],["Prednisone","Corticosteroid","Endocrine"],["Estradiol","Estrogen","Endocrine"],

  ["Lithium","Mood stabilizer","Psychiatry/Neurology"],["Valproic acid","Anticonvulsant","Psychiatry/Neurology"],["Lamotrigine","Anticonvulsant","Psychiatry/Neurology"],
  ["Carbamazepine","Anticonvulsant","Psychiatry/Neurology"],["Phenytoin","Anticonvulsant","Psychiatry/Neurology"],["Levetiracetam","Anticonvulsant","Psychiatry/Neurology"],
  ["Sertraline","Antidepressant","Psychiatry/Neurology"],["Fluoxetine","Antidepressant","Psychiatry/Neurology"],["Escitalopram","Antidepressant","Psychiatry/Neurology"],
  ["Citalopram","Antidepressant","Psychiatry/Neurology"],["Paroxetine","Antidepressant","Psychiatry/Neurology"],["Venlafaxine","Antidepressant","Psychiatry/Neurology"],
  ["Duloxetine","Antidepressant","Psychiatry/Neurology"],["Bupropion","Antidepressant","Psychiatry/Neurology"],["Trazodone","Antidepressant","Psychiatry/Neurology"],
  ["Quetiapine","Antipsychotic","Psychiatry/Neurology"],["Olanzapine","Antipsychotic","Psychiatry/Neurology"],["Risperidone","Antipsychotic","Psychiatry/Neurology"],
  ["Aripiprazole","Antipsychotic","Psychiatry/Neurology"],["Haloperidol","Antipsychotic","Psychiatry/Neurology"],["Clozapine","Antipsychotic","Psychiatry/Neurology"],
  ["Alprazolam","Benzodiazepine","Psychiatry/Neurology"],["Lorazepam","Benzodiazepine","Psychiatry/Neurology"],["Clonazepam","Benzodiazepine","Psychiatry/Neurology"],["Diazepam","Benzodiazepine","Psychiatry/Neurology"],
  ["Amphetamine/dextroamphetamine","Stimulant","Psychiatry/Neurology"],["Methylphenidate","Stimulant","Psychiatry/Neurology"],
  ["Zolpidem","Sedative-hypnotic","Psychiatry/Neurology"],["Donepezil","Cholinesterase inhibitor","Psychiatry/Neurology"],["Sumatriptan","Triptan","Psychiatry/Neurology"],
  ["Varenicline","Smoking cessation","Psychiatry/Neurology"],

  ["Fentanyl","Opioid agonist","Pain"],["Oxycodone","Opioid agonist","Pain"],["Hydrocodone/acetaminophen","Opioid agonist","Pain"],["Morphine","Opioid agonist","Pain"],
  ["Hydromorphone","Opioid agonist","Pain"],["Methadone","Opioid agonist","Pain"],["Tramadol","Opioid agonist","Pain"],["Buprenorphine","Opioid partial agonist","Pain"],
  ["Naloxone","Opioid antagonist","Pain"],["Ibuprofen","NSAID","Pain"],["Naproxen","NSAID","Pain"],["Meloxicam","NSAID","Pain"],["Celecoxib","NSAID","Pain"],
  ["Diclofenac","NSAID","Pain"],["Acetaminophen","Analgesic/antipyretic","Pain"],["Gabapentin","Gabapentinoid","Pain"],["Pregabalin","Gabapentinoid","Pain"],["Cyclobenzaprine","Muscle relaxant","Pain"],

  ["Methotrexate","DMARD","Immunology/Rheumatology"],["Hydroxychloroquine","DMARD","Immunology/Rheumatology"],["Leflunomide","DMARD","Immunology/Rheumatology"],
  ["Sulfasalazine","DMARD","Immunology/Rheumatology"],["Adalimumab","Biologic DMARD","Immunology/Rheumatology"],["Tacrolimus","Immunosuppressant","Immunology/Rheumatology"],
  ["Cyclosporine","Immunosuppressant","Immunology/Rheumatology"],["Azathioprine","Immunosuppressant","Immunology/Rheumatology"],
  ["Allopurinol","Antigout","Immunology/Rheumatology"],["Colchicine","Antigout","Immunology/Rheumatology"],

  ["Amoxicillin","Penicillin","Infectious disease"],["Amoxicillin/clavulanate","Penicillin","Infectious disease"],["Penicillin VK","Penicillin","Infectious disease"],
  ["Piperacillin/tazobactam","Penicillin","Infectious disease"],["Cephalexin","Cephalosporin","Infectious disease"],["Cefdinir","Cephalosporin","Infectious disease"],
  ["Ceftriaxone","Cephalosporin","Infectious disease"],["Azithromycin","Macrolide","Infectious disease"],["Clarithromycin","Macrolide","Infectious disease"],
  ["Doxycycline","Tetracycline","Infectious disease"],["Minocycline","Tetracycline","Infectious disease"],["Ciprofloxacin","Fluoroquinolone","Infectious disease"],["Levofloxacin","Fluoroquinolone","Infectious disease"],
  ["Sulfamethoxazole/trimethoprim","Sulfonamide","Infectious disease"],["Nitrofurantoin","Urinary antibacterial","Infectious disease"],["Metronidazole","Nitroimidazole","Infectious disease"],
  ["Linezolid","Oxazolidinone","Infectious disease"],["Vancomycin","Glycopeptide","Infectious disease"],["Daptomycin","Lipopeptide","Infectious disease"],
  ["Gentamicin","Aminoglycoside","Infectious disease"],["Clindamycin","Lincosamide","Infectious disease"],
  ["Fluconazole","Azole antifungal","Infectious disease"],["Valacyclovir","Antiviral","Infectious disease"],["Oseltamivir","Antiviral","Infectious disease"],

  ["Omeprazole","Proton pump inhibitor","Gastrointestinal"],["Esomeprazole","Proton pump inhibitor","Gastrointestinal"],["Pantoprazole","Proton pump inhibitor","Gastrointestinal"],
  ["Famotidine","H2 blocker","Gastrointestinal"],["Ondansetron","Antiemetic","Gastrointestinal"],["Metoclopramide","Antiemetic","Gastrointestinal"],["Docusate","Laxative","Gastrointestinal"],

  ["Albuterol","Bronchodilator","Respiratory"],["Tiotropium","Bronchodilator","Respiratory"],["Fluticasone/salmeterol","Inhaled corticosteroid/LABA","Respiratory"],
  ["Montelukast","Leukotriene modifier","Respiratory"],["Cetirizine","Antihistamine","Respiratory"],["Diphenhydramine","Antihistamine","Respiratory"],

  ["Tamsulosin","Alpha blocker","Urology"],["Finasteride","5-alpha reductase inhibitor","Urology"],["Sildenafil","PDE5 inhibitor","Urology"],
  ["Tadalafil","PDE5 inhibitor","Urology"],["Oxybutynin","Antimuscarinic","Urology"],
  ["Isotretinoin","Retinoid","Dermatology"],["Tretinoin","Retinoid","Dermatology"]
];
