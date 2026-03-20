const DAYS=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],FDAYS=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const HABITS=[
{id:"med_am",label:"AM meds taken",icon:"💊",critical:!0},
{id:"med_pm",label:"PM meds taken",icon:"💊",critical:!0},
{id:"supplement",label:"Supplements taken",icon:"💊",critical:!0},
{id:"walk_breakfast",label:"Post-breakfast walk",icon:"🚶"},
{id:"walk_lunch",label:"Post-lunch walk",icon:"🚶"},
{id:"walk_dinner",label:"Post-dinner walk",icon:"🚶"},
{id:"workout",label:"Workout completed",icon:"💪"},
{id:"protein_first",label:"Protein first at meals",icon:"🥩"},
{id:"water",label:"Water 2.5L+",icon:"💧"},
{id:"bed_10",label:"In bed by 10 PM",icon:"🌙"},
{id:"no_sugar",label:"No sugary drinks",icon:"🚫"}];
const SCHEDULE=[
{time:"6:00 AM",act:"Wake up",det:"Bright light within 5 min.",icon:"☀️",tag:"wake"},
{time:"6:05 AM",act:"Medications",det:"Take prescribed AM meds & supplements.",icon:"💊",tag:"meds"},
{time:"6:15 AM",act:"Hydrate + Prep",det:"16 oz water. Stretching. Prep breakfast.",icon:"💧",tag:"prep"},
{time:"6:45 AM",act:"Breakfast",det:"Protein & fiber FIRST, carbs LAST.",icon:"🍳",tag:"meal"},
{time:"7:05 AM",act:"Post-breakfast walk",det:"10 min brisk. Helps with energy & digestion.",icon:"🚶",tag:"walk"},
{time:"7:15 AM",act:"Ready for work",det:"Leave by 7:30-7:45.",icon:"👔",tag:"work"},
{time:"12:00 PM",act:"Lunch",det:"Balanced meal. Walk 10 min after.",icon:"🥗",tag:"meal"},
{time:"3:00 PM",act:"Snack",det:"Almonds, yogurt, or veggies + hummus.",icon:"🥜",tag:"snack"},
{time:"6:00 PM",act:"Off work",det:"Workout clothes ON. Don't sit down!",icon:"🏠",tag:"work"},
{time:"6:15 PM",act:"Workout",det:"See Workout tab.",icon:"💪",tag:"exercise"},
{time:"7:15 PM",act:"Cool down",det:"Stretch + foam roll.",icon:"🧘",tag:"recovery"},
{time:"7:45 PM",act:"Dinner",det:"Protein + veggies first, carbs last.",icon:"🍽️",tag:"meal"},
{time:"8:05 PM",act:"Post-dinner walk",det:"10-15 min. Most impactful walk!",icon:"🌆",tag:"walk"},
{time:"9:00 PM",act:"Wind down",det:"Dim lights. No screens. Meditate.",icon:"📖",tag:"wind"},
{time:"10:00 PM",act:"Lights out",det:"8 hours sleep. Non-negotiable.",icon:"🌙",tag:"sleep"}];
const WK={
Mon:{title:"Strength: Upper Body",type:"strength",dur:"50 min",color:"#E74C3C",ex:[
{n:"Bench Press / Push-ups",s:3,r:"10",m:"Chest",rest:"90s"},
{n:"Dumbbell Rows",s:3,r:"10",m:"Back",rest:"90s"},
{n:"Overhead Press",s:3,r:"10",m:"Shoulders",rest:"90s"},
{n:"Bicep Curls",s:3,r:"12",m:"Biceps",rest:"60s"},
{n:"Tricep Dips",s:3,r:"12",m:"Triceps",rest:"60s"},
{n:"Plank",s:3,r:"30s",m:"Core",rest:"45s"}]},
Tue:{title:"Cardio: Walk / Jog",type:"cardio",dur:"45 min",color:"#3498DB",ex:[
{n:"Warm-up walk",s:1,r:"5 min",m:"",rest:"—"},
{n:"Brisk walk or jog",s:1,r:"35 min",m:"HR: 60-70% max (~113-131 bpm)",rest:"—"},
{n:"Cool-down walk",s:1,r:"5 min",m:"",rest:"—"}]},
Wed:{title:"Strength: Lower Body",type:"strength",dur:"50 min",color:"#E74C3C",ex:[
{n:"Goblet Squats",s:3,r:"12",m:"Quads, Glutes",rest:"90s"},
{n:"Romanian Deadlifts",s:3,r:"10",m:"Hamstrings",rest:"90s"},
{n:"Walking Lunges",s:3,r:"10/leg",m:"Legs",rest:"60s"},
{n:"Leg Press / Wall Sits",s:3,r:"12",m:"Quads",rest:"90s"},
{n:"Calf Raises",s:3,r:"15",m:"Calves",rest:"45s"},
{n:"Glute Bridges",s:3,r:"12",m:"Glutes",rest:"60s"}]},
Thu:{title:"HIIT Intervals",type:"hiit",dur:"30 min",color:"#E67E22",ex:[
{n:"Warm-up",s:1,r:"5 min",m:"Light jog / walk",rest:"—"},
{n:"Sprint / Bike / Row",s:8,r:"30s hard",m:"90s recovery each round",rest:"90s"},
{n:"Cool-down",s:1,r:"5 min",m:"Walk + stretch",rest:"—"}]},
Fri:{title:"Strength: Full Body",type:"strength",dur:"50 min",color:"#E74C3C",ex:[
{n:"Deadlifts",s:3,r:"8",m:"Posterior chain",rest:"120s"},
{n:"Pull-ups / Lat Pulldown",s:3,r:"10",m:"Back, Biceps",rest:"90s"},
{n:"Dumbbell Bench Press",s:3,r:"10",m:"Chest",rest:"90s"},
{n:"Kettlebell Swings",s:3,r:"15",m:"Hips, Core",rest:"60s"},
{n:"Farmer's Walks",s:3,r:"40s",m:"Grip, Core",rest:"60s"},
{n:"Ab Wheel / Crunches",s:3,r:"15",m:"Core",rest:"45s"}]},
Sat:{title:"Active Recovery / Fun",type:"cardio",dur:"50 min",color:"#3498DB",ex:[
{n:"Outdoor activity",s:1,r:"45-60 min",m:"Hiking, cycling, swim, basketball",rest:"—"}]},
Sun:{title:"Rest + Mobility",type:"rest",dur:"20 min",color:"#2ECC71",ex:[
{n:"Yoga / Stretching",s:1,r:"20 min",m:"Full body",rest:"—"},
{n:"Foam Rolling",s:1,r:"10 min",m:"All major groups",rest:"—"},
{n:"Post-meal walks",s:3,r:"10 min",m:"Required on rest days!",rest:"—"}]}};

// ═══ FLEXIBLE MEAL OPTIONS ═══
// Each meal slot now has multiple options. Option 0 is the default (original plan).
const MEALS={
Mon:{b:[
  {t:"Spinach Feta Omelet",d:"3-egg omelet w/ spinach, tomatoes, feta. 1 whole grain toast. ½ avocado.",p:32,c:28,f:8,cal:420,tags:["protein","fiber"]},
  {t:"Greek Yogurt Power Bowl",d:"Plain Greek yogurt, mixed berries, 2 tbsp chia seeds, 10 almonds, cinnamon.",p:28,c:22,f:10,cal:380,tags:["protein","quick"]},
  {t:"Egg & Veggie Muffins",d:"3 egg muffins w/ bell peppers, spinach, cheese. Side of berries.",p:30,c:18,f:6,cal:350,tags:["protein","quick","lowcarb"]},
  {t:"Cottage Cheese & Berry Bowl",d:"1 cup cottage cheese, mixed berries, 2 tbsp chia seeds, walnuts, cinnamon. High casein = slow digestion.",p:38,c:18,f:11,cal:380,tags:["protein","fiber","quick"]},
  {t:"Paneer Bhurji & Chia Raita",d:"Scrambled paneer w/ spinach, peppers, onion, turmeric. Side of chia-yogurt raita.",p:39,c:12,f:9,cal:400,tags:["protein","lowcarb","indian"]},
  {t:"Smoked Salmon Scramble",d:"3 eggs scrambled w/ smoked salmon, spinach, avocado. 2g+ EPA/DHA omega-3s.",p:37,c:4,f:9,cal:460,tags:["protein","omega3","lowcarb"]}
],l:[
  {t:"Grilled Chicken Salad",d:"Mixed greens, chickpeas, cucumber, olives, olive oil + lemon. Small apple.",p:38,c:32,f:9,cal:450,tags:["protein","fiber"]},
  {t:"Chicken & Lentil Soup",d:"Hearty lentil soup w/ shredded chicken, carrots, celery. Small whole wheat roll.",p:35,c:38,f:12,cal:430,tags:["protein","fiber"]},
  {t:"Tuna Stuffed Avocado",d:"Olive oil tuna in avocado halves. Side salad w/ chickpeas & cucumber.",p:34,c:20,f:8,cal:410,tags:["protein","omega3","lowcarb"]},
  {t:"Greek Chicken Souvlaki Bowl",d:"Grilled chicken, cucumber-tomato salad, olives, tzatziki, feta. No pita.",p:42,c:10,f:8,cal:450,tags:["protein","lowcarb"]},
  {t:"Chicken Keema Matar",d:"Spiced ground chicken w/ peas, turmeric, cumin. Cauliflower rice. Raita side.",p:32,c:16,f:8,cal:400,tags:["protein","indian","lowcarb"]},
  {t:"Sheet Pan Salmon & Broccoli",d:"6oz salmon w/ roasted broccoli, asparagus, lemon-herb dressing.",p:36,c:8,f:8,cal:380,tags:["protein","omega3","lowcarb"]}
],d:[
  {t:"Baked Salmon",d:"6oz salmon, roasted broccoli & cauliflower. ½ cup brown rice.",p:42,c:30,f:7,cal:480,tags:["protein","omega3"]},
  {t:"Chicken & Veggie Sheet Pan",d:"Chicken thighs w/ roasted zucchini, bell peppers, onions. Quinoa side.",p:40,c:32,f:8,cal:470,tags:["protein","fiber"]},
  {t:"Turkey Meatballs & Zoodles",d:"Turkey meatballs in marinara over zucchini noodles. Side salad.",p:38,c:22,f:6,cal:400,tags:["protein","lowcarb"]},
  {t:"Turkey & Three-Bean Chili",d:"Lean turkey, kidney beans, black beans, pinto beans, tomatoes, spices. Avocado on top.",p:34,c:26,f:12,cal:450,tags:["protein","fiber"]},
  {t:"Herb-Baked Salmon & Quinoa",d:"6oz salmon w/ herb crust, steamed broccoli, ½ cup quinoa. Lemon drizzle.",p:38,c:22,f:8,cal:480,tags:["protein","omega3","fiber"]},
  {t:"Chicken Saag & Bajra Roti",d:"Chicken in spinach-onion gravy. 1 bajra (millet) roti. Cucumber raita.",p:38,c:22,f:9,cal:480,tags:["protein","indian","fiber"]}
],s:[
  {t:"Greek yogurt + almonds",d:"Plain Greek yogurt, 10 almonds, cinnamon.",p:16,c:12,f:2,cal:180,tags:["protein","quick"]},
  {t:"Cottage cheese & berries",d:"½ cup cottage cheese, mixed berries, pumpkin seeds.",p:18,c:14,f:3,cal:190,tags:["protein","quick"]},
  {t:"Hard-boiled eggs",d:"2 hard-boiled eggs, cherry tomatoes, everything seasoning.",p:14,c:4,f:1,cal:160,tags:["protein","lowcarb","quick"]},
  {t:"Turkey & Cheese Roll-Ups",d:"Turkey slices wrapped around string cheese w/ mustard. Veggie sticks.",p:19,c:5,f:2,cal:155,tags:["protein","lowcarb","quick"]},
  {t:"Roasted Chana & Paneer Mix",d:"Spiced roasted chana, cubed paneer, peanuts. High protein, crunchy snack.",p:15,c:13,f:5,cal:240,tags:["protein","indian","fiber"]},
  {t:"Sardines on Crackers",d:"Sardines in olive oil on 4 whole grain crackers, lemon squeeze. Omega-3 powerhouse.",p:14,c:10,f:4,cal:180,tags:["omega3","protein"]}
]},
Tue:{b:[
  {t:"Overnight Oats",d:"⅓ cup steel-cut oats, chia, protein powder, walnuts, berries.",p:28,c:35,f:10,cal:400,tags:["fiber","protein"]},
  {t:"Veggie Scramble",d:"3 eggs scrambled w/ mushrooms, spinach, tomatoes. Whole grain toast.",p:30,c:24,f:6,cal:380,tags:["protein","veg"]},
  {t:"Protein Smoothie Bowl",d:"Protein powder, frozen berries, spinach, almond butter. Top: granola & seeds.",p:32,c:30,f:8,cal:390,tags:["protein","quick"]},
  {t:"Masoor Dal Cheela & Egg",d:"Red lentil crepe w/ 1 fried egg, green chutney. High protein, low GI lentil flour.",p:30,c:24,f:9,cal:400,tags:["protein","indian","fiber"]},
  {t:"Loaded Veggie Frittata",d:"4-egg frittata w/ spinach, peppers, onions, feta. Side cottage cheese & avocado.",p:38,c:10,f:10,cal:450,tags:["protein","lowcarb","fiber"]},
  {t:"Protein Chia Pudding",d:"Chia seeds soaked in protein shake overnight. Top: Greek yogurt, berries, flax. Prep night before.",p:35,c:16,f:12,cal:370,tags:["protein","fiber","quick"]}
],l:[
  {t:"Turkey Lettuce Wraps",d:"3 wraps w/ turkey & avocado. Cup of lentil soup.",p:36,c:28,f:10,cal:420,tags:["protein","lowcarb"]},
  {t:"Grilled Chicken Bowl",d:"Brown rice, grilled chicken, black beans, salsa, guacamole, lime.",p:40,c:36,f:10,cal:480,tags:["protein","fiber"]},
  {t:"Egg Salad on Greens",d:"Egg salad (3 eggs, Greek yogurt, mustard) over mixed greens. Whole wheat crackers.",p:30,c:22,f:6,cal:380,tags:["protein","quick"]},
  {t:"Turkey Taco Cauli-Rice Bowl",d:"Seasoned ground turkey, cauliflower rice, black beans, salsa, avocado, cheese.",p:35,c:18,f:9,cal:430,tags:["protein","lowcarb","fiber"]},
  {t:"Sardine Mediterranean Salad",d:"Sardines, white beans, arugula, olives, sun-dried tomatoes, lemon-olive oil dressing.",p:30,c:15,f:8,cal:420,tags:["omega3","protein","fiber"]},
  {t:"Soya Chunks & Veggie Curry",d:"Soya chunks (52g protein/100g dry!) w/ mixed veggies. 1 jowar roti.",p:32,c:25,f:10,cal:380,tags:["protein","fiber","indian","veg"]}
],d:[
  {t:"Chicken Stir-Fry",d:"Bell peppers, snap peas, mushrooms, olive oil. Cauliflower rice.",p:38,c:20,f:6,cal:400,tags:["protein","lowcarb"]},
  {t:"Baked Cod & Veggies",d:"6oz cod, roasted asparagus & cherry tomatoes. Small sweet potato.",p:40,c:32,f:7,cal:430,tags:["protein","omega3"]},
  {t:"Stuffed Bell Peppers",d:"Peppers stuffed w/ ground turkey, quinoa, black beans, cheese.",p:36,c:30,f:8,cal:420,tags:["protein","fiber"]},
  {t:"Zucchini Lasagna w/ Turkey",d:"Zucchini slices replace noodles. Turkey-ricotta filling, marinara, mozzarella.",p:32,c:13,f:8,cal:420,tags:["protein","lowcarb"]},
  {t:"Tandoori Salmon & Kachumber",d:"Salmon in yogurt-tandoori marinade w/ turmeric. Lentil side, cucumber-onion salad.",p:38,c:18,f:12,cal:520,tags:["protein","omega3","indian","fiber"]},
  {t:"Mediterranean Baked Cod",d:"Cod baked w/ cannellini beans, cherry tomatoes, olives, capers. Arugula salad.",p:38,c:20,f:9,cal:450,tags:["protein","omega3","fiber"]}
],s:[
  {t:"Walnuts + pear",d:"1oz walnuts, 1 small pear.",p:6,c:18,f:5,cal:220,tags:["omega3","fiber"]},
  {t:"Celery & almond butter",d:"3 celery stalks, 1.5 tbsp almond butter.",p:6,c:8,f:3,cal:170,tags:["lowcarb","quick"]},
  {t:"Edamame",d:"1 cup shelled edamame, sea salt, lemon squeeze.",p:17,c:10,f:6,cal:190,tags:["protein","veg","quick"]},
  {t:"Tuna Cucumber Boats",d:"Olive oil tuna stuffed in cucumber halves. Flaxseed & lemon on top.",p:17,c:4,f:3,cal:155,tags:["protein","omega3","lowcarb","quick"]},
  {t:"Cottage Cheese & Chia Bowl",d:"½ cup cottage cheese, 1 tbsp chia seeds, berries. Casein = slow-release protein.",p:15,c:8,f:5,cal:175,tags:["protein","fiber","quick"]},
  {t:"Paneer Tikka Bites",d:"Grilled paneer cubes w/ tikka spices. Mint chutney for dipping.",p:16,c:5,f:2,cal:235,tags:["protein","indian","lowcarb"]}
]},
Wed:{b:[
  {t:"Eggs + Smoothie",d:"2 boiled eggs. Smoothie: spinach, protein, ½ banana, almond butter.",p:34,c:26,f:6,cal:410,tags:["protein"]},
  {t:"Avocado Toast & Eggs",d:"Whole grain toast, mashed avocado, 2 poached eggs, everything seasoning.",p:26,c:28,f:8,cal:400,tags:["protein","fiber"]},
  {t:"Moong Dal Cheela",d:"Savory moong dal crepe w/ paneer filling. Mint chutney. Yogurt.",p:28,c:24,f:6,cal:360,tags:["protein","veg","indian"]},
  {t:"Besan Chilla & Paneer",d:"Chickpea flour crepe stuffed w/ spiced paneer, spinach. Mint chutney.",p:34,c:24,f:9,cal:430,tags:["protein","indian","fiber"]},
  {t:"Sardine Avocado Toast",d:"Sardines on Ezekiel bread w/ mashed avocado, lemon, chili flakes. 2g+ omega-3s.",p:33,c:15,f:9,cal:450,tags:["protein","omega3","fiber"]},
  {t:"Egg & Cottage Cheese Scramble",d:"3 eggs + ¼ cup cottage cheese scrambled together. Avocado & flaxseed. Ultra low carb.",p:35,c:5,f:9,cal:430,tags:["protein","lowcarb","quick"]}
],l:[
  {t:"Black Bean Bowl",d:"Black beans, grilled peppers, salsa, small brown rice, lime.",p:22,c:40,f:14,cal:420,tags:["fiber","veg"]},
  {t:"Chicken Caesar Lettuce Cups",d:"Grilled chicken, romaine cups, Parmesan, light Caesar. Side of lentils.",p:38,c:20,f:8,cal:410,tags:["protein","lowcarb"]},
  {t:"Dal Tadka & Roti",d:"Yellow dal w/ cumin tempering. 1 whole wheat roti. Cucumber raita.",p:20,c:36,f:10,cal:380,tags:["fiber","veg","indian"]},
  {t:"Canned Salmon Avocado Bowl",d:"Salmon, avocado, spinach, cherry tomatoes, pumpkin seeds. Lemon-olive oil. Zero cooking!",p:38,c:8,f:8,cal:430,tags:["protein","omega3","lowcarb","quick"]},
  {t:"Cottage Cheese Protein Plate",d:"1 cup cottage cheese, raw veggies (cucumber, peppers, tomatoes), pumpkin seeds, flaxseed.",p:32,c:14,f:9,cal:380,tags:["protein","fiber","quick","lowcarb"]},
  {t:"Quinoa Khichdi w/ Tofu",d:"Quinoa-moong dal khichdi w/ spinach, cubed tofu, turmeric. Complete amino acids.",p:30,c:28,f:9,cal:420,tags:["protein","fiber","indian","veg"]}
],d:[
  {t:"Kebabs",d:"Lamb/beef kebabs (6oz) w/ grilled zucchini & eggplant. Tzatziki.",p:42,c:18,f:5,cal:440,tags:["protein","lowcarb"]},
  {t:"Grilled Fish Tacos",d:"Tilapia in corn tortillas, cabbage slaw, avocado crema. Black beans.",p:36,c:34,f:9,cal:460,tags:["protein","omega3","fiber"]},
  {t:"Palak Chicken",d:"Chicken in spinach gravy. ½ cup brown rice. Cucumber salad.",p:40,c:28,f:6,cal:430,tags:["protein","indian"]},
  {t:"Pumpkin Turkey Chili",d:"Ground turkey, pumpkin purée, black beans, tomatoes, chili spice. Pumpkin adds fiber, not carbs!",p:34,c:26,f:15,cal:415,tags:["protein","fiber"]},
  {t:"Sardine & Zoodle Bowl",d:"Sardines w/ zucchini noodles, cherry tomatoes, capers, Parmesan. 15 min dinner.",p:35,c:16,f:10,cal:520,tags:["protein","omega3","lowcarb","quick"]},
  {t:"Methi Chana & Paneer Curry",d:"Fenugreek-chickpea curry w/ paneer. Methi slows carb digestion. ½ cup brown rice.",p:30,c:28,f:12,cal:450,tags:["protein","fiber","indian","veg"]}
],s:[
  {t:"Veggies + hummus",d:"Celery & carrot sticks, 2 tbsp hummus.",p:5,c:14,f:4,cal:140,tags:["fiber","veg","quick"]},
  {t:"Roasted chickpeas",d:"½ cup crispy chickpeas w/ paprika & garlic.",p:10,c:22,f:6,cal:180,tags:["fiber","protein","veg"]},
  {t:"String cheese & nuts",d:"2 string cheese, small handful of cashews.",p:16,c:6,f:1,cal:200,tags:["protein","quick","lowcarb"]},
  {t:"Kala Chana Chaat",d:"Black chickpeas w/ peanuts, onion, tomato, lemon, chaat masala. 5g fiber!",p:10,c:12,f:5,cal:175,tags:["fiber","indian","veg"]},
  {t:"Greek Yogurt & Walnuts",d:"Plain Greek yogurt, walnuts, cinnamon. Omega-3 ALA from walnuts.",p:18,c:8,f:3,cal:195,tags:["protein","omega3","quick"]},
  {t:"Walnut-Chia Energy Bites",d:"Walnuts, chia, flax, protein powder, cocoa, almond butter. Batch prep Sunday.",p:10,c:5,f:5,cal:210,tags:["omega3","fiber","protein"]}
]},
Thu:{b:[
  {t:"Vegetable Upma",d:"Small upma w/ peanuts, curry leaves. 1 boiled egg.",p:18,c:30,f:5,cal:340,tags:["indian","veg"]},
  {t:"Masala Omelet",d:"3-egg omelet w/ onion, tomato, green chili, coriander. Whole grain toast.",p:28,c:22,f:4,cal:370,tags:["protein","indian"]},
  {t:"Berry Protein Oatmeal",d:"⅓ cup oats, protein powder, mixed berries, flaxseed, almond milk.",p:30,c:32,f:8,cal:380,tags:["protein","fiber"]},
  {t:"Egg Bhurji w/ Methi & Paneer",d:"Spiced scrambled eggs w/ paneer, fenugreek leaves, broccoli. Methi is great for digestion.",p:33,c:10,f:8,cal:380,tags:["protein","indian","lowcarb","fiber"]},
  {t:"Shakshuka w/ Chickpeas",d:"2 eggs poached in spiced tomato-chickpea sauce, spinach, feta. Whole grain toast.",p:32,c:18,f:8,cal:430,tags:["protein","fiber"]},
  {t:"Savory Mediterranean Yogurt",d:"Greek yogurt, olive oil, walnuts, cucumber, olives, za'atar. Completely savory—great for satiety.",p:34,c:10,f:10,cal:480,tags:["protein","omega3","lowcarb"]}
],l:[
  {t:"Tuna Salad",d:"Olive oil tuna over greens w/ cherry tomatoes & white beans.",p:36,c:22,f:8,cal:400,tags:["protein","omega3"]},
  {t:"Chicken Shawarma Bowl",d:"Spiced chicken, hummus, tabbouleh, pickled turnips. Small pita.",p:38,c:30,f:7,cal:440,tags:["protein"]},
  {t:"Rajma Chawal (Light)",d:"Kidney bean curry. ½ cup brown rice. Side salad.",p:18,c:42,f:14,cal:400,tags:["fiber","veg","indian"]},
  {t:"Greek Yogurt Chicken Wraps",d:"Chicken salad w/ Greek yogurt & walnuts in lettuce cups. Zero bread!",p:40,c:8,f:8,cal:380,tags:["protein","lowcarb","quick"]},
  {t:"Mediterranean Lentil Bowl",d:"Lentils, roasted veggies, feta, olives, lemon-tahini dressing. 12g fiber!",p:35,c:25,f:12,cal:430,tags:["protein","fiber","veg"]},
  {t:"Palak Egg Bhurji & Bajra Roti",d:"Eggs scrambled in spinach gravy. 1 pearl millet roti (lower GI than wheat).",p:30,c:22,f:9,cal:410,tags:["protein","indian","fiber"]}
],d:[
  {t:"Palak Paneer",d:"Palak paneer/tofu, 1 small roti. Cucumber raita.",p:28,c:32,f:6,cal:420,tags:["veg","indian"]},
  {t:"Grilled Chicken Thighs",d:"Herb-marinated thighs, roasted Brussels sprouts, ½ sweet potato.",p:40,c:30,f:7,cal:460,tags:["protein"]},
  {t:"Shrimp & Vegetable Curry",d:"Shrimp in coconut curry w/ spinach & tomatoes. Cauliflower rice.",p:34,c:18,f:5,cal:380,tags:["protein","lowcarb","omega3"]},
  {t:"Cauliflower Chicken Biryani",d:"All the biryani spices (cardamom, cinnamon, saffron) w/ cauliflower rice. 80% less carbs!",p:36,c:14,f:8,cal:440,tags:["protein","indian","lowcarb"]},
  {t:"Greek Chicken & Quinoa Bowl",d:"Grilled chicken, quinoa, tzatziki, cucumber, olives, feta. Complete amino acids.",p:42,c:25,f:8,cal:500,tags:["protein","fiber"]},
  {t:"Mackerel Niçoise Salad",d:"Mackerel, lentils, green beans, egg, olives, Dijon dressing. 13g fiber!",p:40,c:10,f:13,cal:500,tags:["protein","omega3","fiber"]}
],s:[
  {t:"Dark choc + pistachios",d:"1oz dark chocolate (70%+), pistachios.",p:6,c:18,f:3,cal:220,tags:["quick"]},
  {t:"Apple + peanut butter",d:"Apple slices, 1 tbsp natural peanut butter.",p:5,c:22,f:4,cal:200,tags:["fiber","quick"]},
  {t:"Trail mix",d:"1oz mixed nuts, pumpkin seeds, few dark choc chips.",p:8,c:14,f:3,cal:210,tags:["quick","protein"]},
  {t:"Edamame w/ Sea Salt",d:"1 cup shelled edamame, sea salt, lime. All essential amino acids, 6g fiber.",p:14,c:5,f:6,cal:145,tags:["protein","veg","fiber","quick"]},
  {t:"Mini Besan Chilla & Paneer",d:"Small chickpea flour pancake w/ paneer stuffing. Mint chutney dip.",p:14,c:13,f:4,cal:220,tags:["protein","indian","fiber"]},
  {t:"Hummus, Feta & Veggies",d:"Hummus, feta cubes, cucumber, cherry tomatoes, olives. Med-style snack plate.",p:10,c:12,f:4,cal:190,tags:["fiber","veg","quick"]}
]},
Fri:{b:[
  {t:"Protein Pancakes",d:"1 banana + 2 eggs + protein powder. Berries & almond butter.",p:30,c:34,f:5,cal:410,tags:["protein"]},
  {t:"Shakshuka",d:"2 eggs poached in spiced tomato sauce. Whole grain toast for dipping.",p:24,c:28,f:6,cal:380,tags:["protein","veg"]},
  {t:"Dosa & Chutney",d:"2 small plain dosas, coconut chutney, sambar. 1 boiled egg.",p:20,c:34,f:6,cal:370,tags:["indian","veg"]},
  {t:"Tofu Veggie Scramble",d:"Firm tofu scrambled w/ black beans, spinach, peppers, pumpkin seeds. Turmeric.",p:32,c:18,f:11,cal:380,tags:["protein","fiber","veg","lowcarb"]},
  {t:"Smoked Salmon Frittata",d:"Baked frittata w/ salmon, zucchini, dill, goat cheese. Meal prep friendly—reheat 3 min.",p:31,c:4,f:9,cal:420,tags:["protein","omega3","lowcarb","quick"]},
  {t:"Paneer Bhurji & Spinach",d:"Scrambled paneer w/ turmeric, cumin, spinach, tomatoes. ½ bajra roti.",p:39,c:14,f:8,cal:410,tags:["protein","indian","lowcarb"]}
],l:[
  {t:"Mediterranean Wrap",d:"Whole wheat, hummus, chicken, roasted veggies, arugula.",p:34,c:36,f:8,cal:450,tags:["protein","fiber"]},
  {t:"Salmon Salad Bowl",d:"Canned salmon, quinoa, avocado, cucumber, lemon-tahini dressing.",p:36,c:28,f:8,cal:440,tags:["protein","omega3"]},
  {t:"Chole & Roti",d:"Chickpea curry, 1 whole wheat roti, onion-tomato salad.",p:18,c:40,f:12,cal:400,tags:["fiber","veg","indian"]},
  {t:"Stuffed Bell Peppers",d:"Peppers w/ turkey, black beans, cauliflower rice, cheese, salsa.",p:33,c:20,f:8,cal:420,tags:["protein","fiber"]},
  {t:"Chicken Keema & Cauli Rice",d:"Spiced ground chicken w/ peas & turmeric over cauliflower rice. Cooling raita.",p:32,c:16,f:8,cal:400,tags:["protein","indian","lowcarb"]},
  {t:"Masala Egg Muffins & Chilla",d:"Prep-ahead egg muffins w/ veggies + small besan chilla. Grab-and-go Indian lunch.",p:32,c:15,f:8,cal:420,tags:["protein","indian","quick"]}
],d:[
  {t:"Fish Curry",d:"Shrimp/fish curry w/ vegetables. ½ cup quinoa.",p:38,c:28,f:6,cal:430,tags:["protein","omega3"]},
  {t:"Chicken Tikka Masala (Light)",d:"Grilled chicken in light yogurt-tomato sauce. ½ cup brown rice. Raita.",p:40,c:30,f:5,cal:450,tags:["protein","indian"]},
  {t:"Eggplant Parmesan",d:"Baked (not fried) eggplant, marinara, mozzarella. Large salad.",p:24,c:28,f:8,cal:380,tags:["veg","fiber"]},
  {t:"Stuffed Chicken Breast",d:"Chicken stuffed w/ spinach & feta. Roasted cauliflower, side of lentils.",p:42,c:16,f:10,cal:460,tags:["protein","fiber","lowcarb"]},
  {t:"Tandoori Salmon & Lentils",d:"Yogurt-tandoori salmon, warm lentil salad, kachumber. 12g fiber & omega-3s.",p:38,c:18,f:12,cal:520,tags:["protein","omega3","indian","fiber"]},
  {t:"Low-Carb Zucchini Lasagna",d:"Zucchini sheets, turkey-ricotta filling, spinach, marinara. No pasta needed.",p:32,c:13,f:8,cal:420,tags:["protein","lowcarb"]}
],s:[
  {t:"Edamame",d:"1 cup shelled edamame, sea salt.",p:17,c:10,f:6,cal:190,tags:["protein","veg","quick"]},
  {t:"Cucumber & tzatziki",d:"Sliced cucumber, 3 tbsp tzatziki, few olives.",p:5,c:8,f:2,cal:120,tags:["lowcarb","quick","veg"]},
  {t:"Protein bar",d:"Low-sugar protein bar (check: <5g sugar, 15g+ protein).",p:18,c:20,f:4,cal:210,tags:["protein","quick"]},
  {t:"Sardines on Crackers",d:"Sardines in olive oil, 4 seed crackers, lemon. Great source of omega-3s and calcium.",p:14,c:10,f:4,cal:180,tags:["omega3","protein"]},
  {t:"Turkey Roll-Up Sticks",d:"Turkey slices, cream cheese, pickle spear rolled up. Zero-carb, high protein.",p:19,c:3,f:1,cal:150,tags:["protein","lowcarb","quick"]},
  {t:"Roasted Chana Mix",d:"Spiced roasted chickpeas & peanuts. Crunchy & portable.",p:12,c:14,f:5,cal:200,tags:["fiber","indian","protein"]}
]},
Sat:{b:[
  {t:"Pesarattu",d:"Green moong dosa, ginger chutney. Yogurt.",p:22,c:28,f:6,cal:350,tags:["indian","veg"]},
  {t:"Loaded Avocado Toast",d:"Whole grain toast, avocado, smoked salmon, capers, red onion.",p:28,c:24,f:6,cal:400,tags:["protein","omega3"]},
  {t:"Egg Bhurji & Paratha",d:"Spiced scrambled eggs (3). 1 small whole wheat paratha. Chutney.",p:28,c:30,f:4,cal:420,tags:["protein","indian"]},
  {t:"Cottage Cheese Pancakes",d:"Cottage cheese + egg + oat flour pancakes. Berries, almond butter. 38g protein!",p:38,c:22,f:6,cal:420,tags:["protein","fiber"]},
  {t:"Besan Chilla & Egg Combo",d:"Chickpea flour crepe w/ veggies + 2 fried eggs. Tomato chutney. Weekend protein feast.",p:34,c:22,f:8,cal:440,tags:["protein","indian","fiber"]},
  {t:"Salmon & Veggie Frittata",d:"Smoked salmon, zucchini, dill, goat cheese baked frittata. Make ahead Saturday brunch.",p:31,c:4,f:9,cal:420,tags:["protein","omega3","lowcarb"]}
],l:[
  {t:"Paneer Tikka",d:"Grilled tikka, veggie salad. Small dal.",p:30,c:24,f:6,cal:400,tags:["protein","veg","indian"]},
  {t:"Mediterranean Plate",d:"Falafel (baked), hummus, tabbouleh, pickled veggies. Small pita.",p:20,c:38,f:10,cal:430,tags:["fiber","veg"]},
  {t:"Grilled Chicken Caesar",d:"Grilled chicken breast, romaine, Parmesan, light dressing. Croutons.",p:40,c:18,f:4,cal:420,tags:["protein","lowcarb"]},
  {t:"Sardine Avocado Salad",d:"Sardines, avocado, mixed greens, white beans, cherry tomatoes. Lemon-herb dressing.",p:32,c:15,f:10,cal:450,tags:["omega3","protein","fiber"]},
  {t:"Soya Chunk Biryani Bowl",d:"Soya chunks in biryani spices, cauliflower rice, raita, kachumber salad.",p:34,c:16,f:8,cal:380,tags:["protein","indian","lowcarb","veg"]},
  {t:"Lentil & Roasted Veggie Bowl",d:"Green lentils, roasted sweet potato & cauliflower, feta, tahini. 12g fiber.",p:35,c:25,f:12,cal:430,tags:["protein","fiber","veg"]}
],d:[
  {t:"Cauliflower Pizza",d:"Cauliflower crust, veggies, chicken, light cheese. Large salad.",p:34,c:26,f:7,cal:430,tags:["protein","lowcarb"]},
  {t:"Biryani (Balanced)",d:"Chicken biryani w/ ½ cup rice, raita, side salad. Control portion!",p:36,c:38,f:5,cal:480,tags:["protein","indian"]},
  {t:"Grilled Steak & Greens",d:"5oz sirloin, sautéed spinach & mushrooms. Small roasted potatoes.",p:42,c:26,f:6,cal:460,tags:["protein"]},
  {t:"Cauliflower Chicken Biryani",d:"Full biryani flavor (saffron, cardamom, cinnamon) but cauliflower rice. 80% fewer carbs.",p:36,c:14,f:8,cal:440,tags:["protein","indian","lowcarb"]},
  {t:"Herb-Crusted Salmon & Beans",d:"6oz salmon w/ herb crust, sautéed white beans, cherry tomatoes, arugula.",p:40,c:20,f:9,cal:480,tags:["protein","omega3","fiber"]},
  {t:"Turkey & Three-Bean Chili",d:"Lean turkey, three beans, pumpkin purée, spices. 12g fiber, make a big batch.",p:34,c:26,f:12,cal:450,tags:["protein","fiber"]}
],s:[
  {t:"Trail mix",d:"1oz mixed nuts, pumpkin seeds.",p:8,c:12,f:3,cal:200,tags:["quick"]},
  {t:"Greek yogurt parfait",d:"Plain Greek yogurt, honey drizzle, granola, berries.",p:18,c:22,f:3,cal:230,tags:["protein","quick"]},
  {t:"Masala chai + almonds",d:"Sugar-free masala chai. 10-12 almonds.",p:8,c:6,f:2,cal:140,tags:["quick","indian","lowcarb"]},
  {t:"Kala Chana Chaat",d:"Black chickpeas, peanuts, onion, tomato, lemon, chaat masala. Street snack made healthy.",p:10,c:12,f:5,cal:175,tags:["fiber","indian","veg"]},
  {t:"Cottage Cheese & Chia Bowl",d:"Cottage cheese, chia seeds, cinnamon, berries. Slow-release casein protein.",p:15,c:8,f:5,cal:175,tags:["protein","fiber","quick"]},
  {t:"Tuna Cucumber Boats",d:"Tuna salad stuffed in cucumber halves. Flaxseed on top. Zero-carb vessel.",p:17,c:4,f:3,cal:155,tags:["protein","omega3","lowcarb","quick"]}
]},
Sun:{b:[
  {t:"Loaded Scramble",d:"3 eggs, mushrooms, onions, peppers. Toast + avocado.",p:30,c:28,f:8,cal:430,tags:["protein","fiber"]},
  {t:"Idli & Sambar",d:"3 idlis, sambar, coconut chutney. 1 boiled egg on side.",p:22,c:36,f:6,cal:380,tags:["indian","veg"]},
  {t:"Banana Walnut Oatmeal",d:"Steel-cut oats, ½ banana, walnuts, protein powder, cinnamon.",p:28,c:38,f:8,cal:400,tags:["fiber","protein"]},
  {t:"Full English (Low-Carb)",d:"3 eggs, turkey sausage, grilled tomatoes, mushrooms, avocado, spinach. No toast needed.",p:40,c:10,f:9,cal:460,tags:["protein","lowcarb"]},
  {t:"Paneer Paratha & Raita",d:"Whole wheat paneer paratha (1 small), mint raita, pickle. Weekend special.",p:30,c:28,f:6,cal:420,tags:["protein","indian"]},
  {t:"Salmon Avocado Plate",d:"Smoked salmon, avocado, 2 boiled eggs, capers, cucumber. Omega-3 brunch.",p:38,c:6,f:8,cal:470,tags:["protein","omega3","lowcarb"]}
],l:[
  {t:"Rasam + Rice",d:"Rasam, ½ cup brown rice. Stir-fried veggies + paneer. Buttermilk.",p:24,c:36,f:8,cal:420,tags:["indian","veg"]},
  {t:"Quinoa Veggie Bowl",d:"Quinoa, roasted sweet potato, chickpeas, kale, tahini dressing.",p:22,c:40,f:12,cal:440,tags:["fiber","veg"]},
  {t:"Chicken Soup & Bread",d:"Hearty chicken vegetable soup. 1 slice whole grain bread. Side salad.",p:32,c:28,f:8,cal:380,tags:["protein"]},
  {t:"Greek Chicken Power Bowl",d:"Grilled chicken, quinoa, feta, olives, cucumber-tomato, tzatziki. 42g protein.",p:42,c:25,f:8,cal:500,tags:["protein","fiber"]},
  {t:"Cottage Cheese & Veggie Plate",d:"Cottage cheese, raw veggies, pumpkin seeds, flax. 5-min assembly, high protein.",p:32,c:14,f:9,cal:380,tags:["protein","fiber","lowcarb","quick"]},
  {t:"Dal Tadka & Bajra Roti",d:"Yellow dal w/ garlic tempering. 1 millet roti. Onion-cucumber raita.",p:22,c:26,f:10,cal:380,tags:["fiber","indian","veg"]}
],d:[
  {t:"Grilled Chicken",d:"6oz breast, small sweet potato, steamed green beans.",p:42,c:30,f:7,cal:440,tags:["protein"]},
  {t:"Dal Makhani & Rice",d:"Dal makhani (light cream). ½ cup brown rice. Salad.",p:22,c:40,f:10,cal:430,tags:["fiber","veg","indian"]},
  {t:"Salmon Teriyaki",d:"6oz salmon, light teriyaki glaze. Steamed broccoli & edamame.",p:42,c:20,f:6,cal:430,tags:["protein","omega3","lowcarb"]},
  {t:"Mackerel & Lentil Niçoise",d:"Mackerel fillet, warm lentils, green beans, egg, olives, Dijon. 13g fiber + omega-3s.",p:40,c:10,f:13,cal:500,tags:["protein","omega3","fiber"]},
  {t:"Chicken Saag & Millet Roti",d:"Chicken in spinach gravy w/ garlic. 1 bajra roti. Raita. Iron + protein.",p:38,c:22,f:9,cal:480,tags:["protein","indian","fiber"]},
  {t:"Pumpkin Turkey Chili",d:"Ground turkey, pumpkin purée, beans, tomatoes. Cinnamon adds warmth. 15g fiber!",p:34,c:26,f:15,cal:415,tags:["protein","fiber"]}
],s:[
  {t:"Apple + almond butter",d:"Apple slices, 1 tbsp almond butter.",p:5,c:22,f:5,cal:200,tags:["fiber","quick"]},
  {t:"Paneer cubes & chaat masala",d:"100g paneer cubes, chaat masala, lemon.",p:18,c:4,f:0,cal:200,tags:["protein","indian","lowcarb","quick"]},
  {t:"Protein shake",d:"Protein powder, almond milk, 1 tbsp peanut butter, ice.",p:30,c:12,f:2,cal:250,tags:["protein","quick"]},
  {t:"Walnut-Chia Energy Bites",d:"Walnuts, chia, flax, protein powder, cocoa, almond butter. Batch prep today!",p:10,c:5,f:5,cal:210,tags:["omega3","fiber"]},
  {t:"Sardine & Avocado Plate",d:"Sardines, avocado slices, lemon, chili flakes. Packed with omega-3s and healthy fats.",p:16,c:4,f:4,cal:220,tags:["omega3","protein","lowcarb"]},
  {t:"Cottage Cheese & Berries",d:"½ cup cottage cheese, mixed berries, chia seeds. Casein for sustained fullness.",p:15,c:10,f:5,cal:180,tags:["protein","fiber","quick"]}
]}};

const TARGETS=[{l:"Body Comp",c:"Current",t:"Goal",i:"⚖️"},{l:"Cardio",c:"Building",t:"200+min/wk",i:"❤️"},{l:"Strength",c:"Building",t:"3x/wk",i:"💪"},{l:"Sleep",c:"Improving",t:"8 hrs/night",i:"🌙"},{l:"Steps",c:"Tracking",t:"10K/day",i:"🚶"},{l:"Exercise",c:"—",t:"200+min/wk",i:"🏃"}];
const LABS=[{t:"Annual Physical",f:"Annually",n:"Schedule"},{t:"Blood Work",f:"Per doctor",n:"Schedule"},{t:"Eye Exam",f:"Annually",n:"Schedule"},{t:"Dental Checkup",f:"Every 6 months",n:"Schedule"}];
const DOC=["Review current supplement stack","Discuss fitness goals & progress","Ask about any new recommendations","Schedule upcoming checkups"];
const TC={wake:"#F59E0B",meds:"#EF4444",prep:"#3B82F6",meal:"#10B981",walk:"#8B5CF6",work:"#6B7280",snack:"#F97316",exercise:"#EC4899",recovery:"#14B8A6",wind:"#6366F1",sleep:"#1E40AF"};
const MTS=[{k:"b",lb:"breakfast",tm:"6:45 AM",ic:"🍳",cl:"#F59E0B"},{k:"l",lb:"lunch",tm:"12:00 PM",ic:"🥗",cl:"#10B981"},{k:"s",lb:"snack",tm:"3:00 PM",ic:"🥜",cl:"#8B5CF6"},{k:"d",lb:"dinner",tm:"7:45 PM",ic:"🍽️",cl:"#3B82F6"}];
const TAG_INFO={protein:{l:"PROTEIN",c:"tag-protein"},fiber:{l:"FIBER",c:"tag-fiber"},lowcarb:{l:"LOW CARB",c:"tag-lowcarb"},omega3:{l:"OMEGA-3",c:"tag-omega3"},quick:{l:"QUICK",c:"tag-quick"},veg:{l:"VEG",c:"tag-veg"},indian:{l:"INDIAN",c:"tag-indian"},custom:{l:"CUSTOM",c:"tag-custom"},picked:{l:"PICKED",c:"tag-picked"}};
