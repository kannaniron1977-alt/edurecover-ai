// Teacher-approved knowledge base (AI may only use this scope)
export const GRAPH=[
 {id:'basic',name:'Basic Number Concepts'},{id:'fractions',name:'Fractions'},{id:'equiv',name:'Equivalent Fractions'},
 {id:'commonden',name:'Common Denominator'},{id:'add',name:'Fraction Addition'},{id:'sub',name:'Fraction Subtraction'},{id:'adv',name:'Advanced Fraction Problems'}];
export const PREREQ={add:'equiv',sub:'add',commonden:'equiv',equiv:'fractions'};
export const KB={add:{rule:'Fractions with different denominators must first be converted to equivalent fractions with a common denominator, then only the numerators are added.',
 misconceptions:['M1: adds numerators and denominators directly','M2: ignores denominator difference','M3: confuses numerator with denominator','M4: applies multiplication rule during addition']},
 equiv:{rule:'Multiplying numerator and denominator by the same non-zero number gives an equivalent fraction.'}};
export const REVISE={equiv:'Quick revision: 1/2 = 2/4 = 3/6. Multiply top and bottom by the same number and the value stays the same.'};
export const Q=[
 {id:'q1',concept:'add',text:'What is 1/2 + 1/3 ?',options:['2/5','5/6','1/6','3/5'],correct:'5/6',
  probe:'Before we fix anything: 1/2 and 1/3 are pieces of different sizes. Can pieces of different sizes be counted together directly? What could you do first?',
  hint:'Try rewriting both fractions so they share the same denominator. Which number do 2 and 3 both divide into?',
  explain:'Convert: 1/2 = 3/6 and 1/3 = 2/6. Same-size pieces can be added: 3/6 + 2/6 = 5/6.'},
 {id:'q2',concept:'add',text:'What is 1/4 + 2/3 ?',options:['3/7','11/12','2/12','3/12'],correct:'11/12',
  probe:'Different context, same idea: what must be true about the pieces before we can add 1/4 and 2/3? How would you get there?',
  hint:'Find a number both 4 and 3 divide into, and rewrite each fraction with it as the denominator.',
  explain:'1/4 = 3/12 and 2/3 = 8/12, so 3/12 + 8/12 = 11/12.'},
 {id:'q3',concept:'add',text:'What is 2/5 + 1/2 ?',options:['3/7','9/10','3/10','2/10'],correct:'9/10',
  probe:'Imagine 2/5 of a pizza and 1/2 of another. What common slice size lets you count both?',
  hint:'5 and 2 both divide into 10. Rewrite each fraction with denominator 10.',
  explain:'2/5 = 4/10 and 1/2 = 5/10, so 4/10 + 5/10 = 9/10.'}];
export const STYLES=['analogy (pizza slices)','visual (number line / bars)','worked example (step-by-step)'];
export const NOTES={text:''};
GRAPH.forEach(n=>n.course=1);GRAPH.push({id:'vars',name:'Variables & Expressions',course:2},{id:'like',name:'Combining Like Terms',course:2},{id:'eq1',name:'One-step Equations',course:3});
PREREQ.like='vars';PREREQ.eq1='like';REVISE.vars='Quick revision: a variable like x is a letter standing for an unknown number; 3x means 3 times x.';REVISE.like='Quick revision: like terms have the same variable, so 3x + 2x = 5x.';
KB.like={rule:'Like terms share the same variable part; add or subtract only their coefficients and keep the variable unchanged.',misconceptions:['adds exponents/multiplies variables (3x+2x=5x^2)','adds coefficient and constant']};
KB.eq1={rule:'Undo the operation with its inverse on BOTH sides to keep the equation balanced.',misconceptions:['uses the same operation instead of the inverse','changes only one side']};
export const KEY={add:/common denominator|same denominator|equivalent|lcd|lcm|convert/i,like:/like terms|coefficient|same variable|combine/i,eq1:/inverse|both sides|undo|subtract|divide|balance/i};
export const SEED={2:{vars:60,like:30},3:{eq1:30}};
Q.forEach(q=>q.course=1);
Q.push({id:'q4',course:2,concept:'like',text:'Simplify 3x + 2x',options:['5x','5x²','6x','5'],correct:'5x',probe:'x stands for the same thing in both terms. If you have 3 of something and 2 more of the same thing, what happens to the "something"?',hint:'Like terms share the same variable, so only the numbers in front (coefficients) are added.',explain:'3x + 2x = (3+2)x = 5x. The variable part stays the same.'},
{id:'q5',course:2,concept:'like',text:'Simplify 4y + y',options:['5y','4y²','5y²','4'],correct:'5y',probe:'What is the coefficient of a lone y? And can you add the coefficients of like terms?',hint:'A lone y means 1y. Add the coefficients 4 and 1 and keep y.',explain:'4y + 1y = 5y.'},
{id:'q6',course:3,concept:'eq1',text:'Solve x + 5 = 12',options:['7','17','5','12'],correct:'7',probe:'Which operation undoes "+5"? What must you do to BOTH sides to keep the equation balanced?',hint:'Apply the inverse operation on both sides: subtract 5.',explain:'x + 5 - 5 = 12 - 5, so x = 7.'},
{id:'q7',course:3,concept:'eq1',text:'Solve 3x = 15',options:['5','12','45','18'],correct:'5',probe:'x is being multiplied by 3. What operation undoes multiplication?',hint:'Divide both sides by 3.',explain:'3x/3 = 15/3, so x = 5.'});
export const COURSES={1:{title:'Fractions & Number Sense',lesson:'Understanding Fractions',intro:'You will learn: numerator/denominator, equivalent fractions, common denominators, fraction addition and subtraction. Objective: add fractions correctly AND explain why the method works. Required mastery: 80%.',sections:['1. Introduction: a fraction names equal parts of a whole.','2. Numerator (parts we have) & denominator (size of the parts).','3. Example: 1/2 = 2/4 - equivalent fractions have the same value.','4. Visual: two bars split into halves and quarters line up exactly.','5. Quick practice: to add fractions, first make the pieces the same size (common denominator).']},
2:{title:'Algebra Fundamentals',lesson:'Variables & Like Terms',intro:'You will learn: variables, expressions, coefficients and combining like terms. Objective: simplify expressions and explain why only like terms combine. Required mastery: 80%.',sections:['1. A variable (x, y) is a letter standing for an unknown number.','2. In 3x, the 3 is the coefficient: 3 groups of x.','3. Like terms have the same variable: 3x and 2x are like terms.','4. Combine like terms by adding coefficients: 3x + 2x = 5x.']},
3:{title:'Equations',lesson:'One-step Equations',intro:'You will learn: what an equation means, inverse operations, keeping both sides balanced. Objective: solve one-step equations and justify each step. Required mastery: 80%.',sections:['1. An equation says two sides are equal, like a balanced scale.','2. Whatever you do to one side, do to the other.','3. Undo addition with subtraction and multiplication with division.','4. Example: x + 5 = 12 → subtract 5 from both sides → x = 7.']}};
GRAPH.push({id:'apt_pct',name:'Percentages (Aptitude)',course:4},{id:'apt_ratio',name:'Ratio & Proportion (Aptitude)',course:4});
PREREQ.apt_pct='apt_pct';PREREQ.apt_ratio='apt_pct';REVISE.apt_pct='Quick revision: percent means "per hundred". 20% = 20/100 = 0.2, and percentage change = change / ORIGINAL value x 100.';
KB.apt_pct={rule:'Percentage of a number = (percent/100) x number. Percentage change = (change / original value) x 100.',misconceptions:['divides by the percent instead of multiplying by percent/100','uses the new value as the base for percentage change']};
KB.apt_ratio={rule:'Share a total by ratio: add ratio parts, divide total by that sum for one part, multiply. For proportion find the unit value first.',misconceptions:['adds ratio numbers to the amount','ignores the total number of parts']};
KEY.apt_pct=/original|base|per (hundred|100)|divide by 100|percent(age)? (of|change)/i;KEY.apt_ratio=/total parts|sum of (the )?(ratio|parts)|unit|per (one|pen)|each|proportion/i;
Q.push({id:'q8',course:4,concept:'apt_pct',text:'What is 20% of 250?',options:['50','5','20','500'],correct:'50',probe:'What does "percent" literally mean? How would you turn 20% into a fraction of 250?',hint:'20% = 20/100. Multiply that by 250.',explain:'20/100 x 250 = 50.'},
{id:'q9',course:4,concept:'apt_pct',text:'A salary rises from 200 to 250. What is the percentage increase?',options:['25%','20%','50%','5%'],correct:'25%',probe:'Percentage change compares the change to which value - the old or the new one?',hint:'Change = 50. Divide by the ORIGINAL value 200, then x100.',explain:'50/200 x 100 = 25%.'},
{id:'q10',course:4,concept:'apt_ratio',text:'Divide 60 in the ratio 2:3. What is the larger share?',options:['36','24','30','40'],correct:'36',probe:'How many equal parts does the total split into? What is one part worth?',hint:'Total parts = 2+3 = 5, so one part = 60/5.',explain:'One part = 12. Larger share = 3 x 12 = 36.'},
{id:'q11',course:4,concept:'apt_ratio',text:'If 4 pens cost 20, what do 10 pens cost?',options:['50','40','80','5'],correct:'50',probe:'Before scaling up, what does ONE pen cost?',hint:'Unit price = 20/4 = 5. Then multiply by 10.',explain:'5 x 10 = 50.'});
COURSES[4]={title:'Aptitude & Reasoning for Placements',lesson:'Percentages & Ratios',intro:'Job-ready aptitude: percentages, ratios and proportion with the SAME diagnose-guide-retest engine. Objective: solve placement-style problems and explain your method. Required mastery: 80%.',sections:['1. Percent means per hundred: 20% = 20/100.','2. Percentage change = change / original x 100.','3. Ratio: add the parts, find one part, then scale.','4. Proportion: find the unit value first, then multiply.']};
// ===== 10 modules + 1 final revision summary per course =====
const m=(title,...s)=>({title,sections:s.map((x,i)=>(i+1)+'. '+x)});

COURSES[1].modules=[
 m('What is a Fraction?','A fraction names equal parts of a whole.','If a pizza is cut into 4 equal slices and you eat 1, you ate 1/4.','The parts MUST be equal in size.'),
 m('Numerator & Denominator','Denominator (bottom) = how many equal parts the whole is split into.','Numerator (top) = how many of those parts we have.','In 3/5 the whole has 5 equal parts and we have 3.'),
 m('Proper, Improper & Mixed','Proper fraction: numerator is smaller than denominator, like 3/4.','Improper fraction: numerator is bigger or equal, like 7/4.','Mixed number: whole + fraction, so 7/4 = 1 3/4.'),
 m('Comparing Fractions','Same denominator: bigger numerator is bigger (3/8 > 2/8).','Same numerator: smaller denominator means bigger pieces (1/2 > 1/3).','Different denominators: make them the same first.'),
 m('Equivalent Fractions','Multiply top and bottom by the same non-zero number: 1/2 = 2/4 = 3/6.','The value stays the same, only piece size and count change.','Visual: bars of halves and quarters line up exactly.'),
 m('Simplifying Fractions','Divide top and bottom by the same common factor.','6/8 divided by 2 gives 3/4.','Stop when no common factor except 1 is left.'),
 m('Common Denominator','To add or subtract you need same-size pieces.','Find a common multiple of the denominators, best the LCM. For 2 and 3 it is 6.','Rewrite: 1/2 = 3/6 and 1/3 = 2/6.'),
 m('Adding Fractions','Step 1: common denominator. Step 2: add ONLY the numerators. Step 3: keep the denominator. Step 4: simplify.','Example: 1/2 + 1/3 = 3/6 + 2/6 = 5/6.','Never add denominators: 1/2 + 1/3 is NOT 2/5.'),
 m('Subtracting Fractions','Same method: common denominator, subtract numerators, keep the denominator.','Example: 3/4 - 1/3 = 9/12 - 4/12 = 5/12.','Check that the answer is smaller than the first fraction.'),
 m('Word Problems & Common Mistakes','Ask: what is the whole and which parts are given?','Ate 1/4 of a pizza and a friend ate 1/2: 1/4 + 2/4 = 3/4.','Mistakes: adding denominators, forgetting to convert, not simplifying.'),
 m('Final Revision Summary','A fraction = equal parts of a whole. Top = parts we have, bottom = size of the parts.','Equivalent fractions: multiply or divide top and bottom by the same number.','Add or subtract: common denominator first, then only the numerators.','Always simplify, and explain WHY the method works.')
];

COURSES[2].modules=[
 m('What is a Variable?','A variable is a letter (x, y) standing for an unknown or changing number.','If x = 4 then x + 1 = 5.','The same letter means the same value within one problem.'),
 m('Terms & Expressions','A term is a number, a variable, or their product: 5, x, 3x.','An expression joins terms with + or -: 3x + 2.','An expression has no equals sign.'),
 m('Coefficients & Constants','In 3x the 3 is the coefficient: 3 groups of x.','A lone x means 1x.','A constant has no variable, like the 7 in 3x + 7.'),
 m('Evaluating Expressions','Replace the variable with its value, then calculate.','If x = 2 then 3x + 1 = 3 x 2 + 1 = 7.','Multiply before you add.'),
 m('Like & Unlike Terms','Like terms have exactly the same variable part: 3x and 2x.','3x and 3y, or x and x squared, are unlike terms.','Only like terms can be combined.'),
 m('Combining Like Terms','Add or subtract the coefficients and keep the variable: 3x + 2x = 5x.','4y + y = 5y because a lone y is 1y.','The variable does not change: 3x + 2x is NOT 5x squared.'),
 m('Simplifying with Brackets','Multiply the outside number with EVERY term inside: 2(x + 3) = 2x + 6.','Then combine like terms: 2(x + 3) + x = 3x + 6.','Forgetting the second term is a common mistake.'),
 m('Words to Expressions','"5 more than x" becomes x + 5.','"3 times y" becomes 3y.','"Twice a number, minus 4" becomes 2x - 4.'),
 m('Common Mistakes','Adding unlike terms: 3x + 2 is not 5x.','Multiplying the variable when adding: 3x + 2x is not 5x squared.','Dropping the sign of a term.'),
 m('Practice: Simplify & Explain','5x + 2x - 3x = (5 + 2 - 3)x = 4x.','2x + 3 + x + 4 = 3x + 7.','Always say WHY: only like terms combine.'),
 m('Final Revision Summary','A variable is a letter for an unknown number; the coefficient is the number in front.','Like terms have the same variable part.','Combine like terms by adding coefficients and keeping the variable: 3x + 2x = 5x.','With brackets, multiply every term inside first.')
];

COURSES[3].modules=[
 m('What is an Equation?','An equation says two expressions are equal, using the = sign.','x + 5 = 12 asks: which number x makes this true?','The solution is the value that makes both sides equal.'),
 m('The Balance Idea','Think of a balanced scale.','Whatever you do to one side, do to the other.','Changing only one side breaks the balance.'),
 m('Inverse Operations','Addition and subtraction undo each other. Multiplication and division undo each other.','To undo +5, subtract 5.','To undo x3, divide by 3.'),
 m('Solving x + a = b','Subtract a from BOTH sides.','x + 5 = 12 gives x = 12 - 5 = 7.','Check: 7 + 5 = 12.'),
 m('Solving x - a = b','Add a to BOTH sides.','x - 4 = 9 gives x = 9 + 4 = 13.','Check: 13 - 4 = 9.'),
 m('Solving ax = b','ax means a times x, so divide BOTH sides by a.','3x = 15 gives x = 15 / 3 = 5.','Check: 3 x 5 = 15.'),
 m('Solving x/a = b','x/a means x divided by a, so multiply BOTH sides by a.','x/4 = 6 gives x = 6 x 4 = 24.','Check: 24 / 4 = 6.'),
 m('Checking Your Answer','Put the value back into the original equation.','If both sides are equal, the answer is right.','Checking catches sign and arithmetic mistakes.'),
 m('Word Problems to Equations','"A number plus 5 is 12" becomes x + 5 = 12.','"3 pens cost 15" becomes 3x = 15.','Define x first, write the equation, then solve.'),
 m('Common Mistakes','Using the same operation instead of the inverse (adding 5 to undo +5).','Changing only one side.','Sign mistakes when moving numbers.'),
 m('Final Revision Summary','An equation is a balanced scale: both sides are equal.','Undo an operation with its inverse, on BOTH sides.','Solve, then check by putting the answer back.','Example: x + 5 = 12, subtract 5 from both sides, x = 7.')
];

COURSES[4].modules=[
 m('What Does Percent Mean?','Percent means "per hundred": 20% = 20/100.','100% is the whole, 50% is half, 25% is a quarter.','A percent is a fraction with denominator 100.'),
 m('Percent, Fraction & Decimal','20% = 20/100 = 1/5 = 0.2.','Percent to decimal: divide by 100.','Decimal to percent: multiply by 100.'),
 m('Percent of a Number','Percent of a number = (percent / 100) x number.','20% of 250 = 20/100 x 250 = 50.','Multiply by percent/100. Do not divide by the percent.'),
 m('Percentage Change','Percentage change = change / ORIGINAL value x 100.','200 to 250: change is 50, so 50/200 x 100 = 25% increase.','The base is always the original (old) value.'),
 m('Discount & Profit Basics','Discount is a percent of the marked price. Selling price = marked price - discount.','Profit = selling price - cost price.','Profit % = profit / cost price x 100.'),
 m('Ratio Basics','A ratio compares quantities, like 2:3.','Ratios simplify like fractions: 10:15 = 2:3.','Order matters: 2:3 is not 3:2.'),
 m('Sharing in a Ratio','Add the ratio parts: 2 + 3 = 5 parts.','One part = total / parts = 60 / 5 = 12.','Shares: 2 x 12 = 24 and 3 x 12 = 36.'),
 m('Proportion & Unit Method','Find the value of ONE unit first, then scale.','4 pens cost 20, so 1 pen costs 5.','10 pens cost 10 x 5 = 50.'),
 m('Word Problem Strategy','Read carefully and find the base or the total.','Decide: percentage, ratio or proportion?','Write the steps, then check the answer is sensible.'),
 m('Common Mistakes & Speed Tips','Using the new value as the base for percentage change.','Forgetting the total number of parts in a ratio.','Tips: 10% = divide by 10, 50% = half, 25% = a quarter.'),
 m('Final Revision Summary','Percent means per hundred.','Percentage change = change / ORIGINAL x 100.','Ratio: add the parts, find one part, then scale.','Proportion: find the unit value first, then multiply.')
];

// Master revision: last summary of each course + one combined summary
export const MASTER_MODULES=[1,2,3,4].map(c=>{const l=COURSES[c].modules[COURSES[c].modules.length-1];return {title:COURSES[c].title+' - Revision',sections:l.sections}}).concat([
 m('Master Revision - Key Rules','Fractions: common denominator first, add only numerators.','Algebra: only like terms combine; 3x + 2x = 5x.','Equations: undo with the inverse on BOTH sides.','Aptitude: percent = per hundred; percentage change uses the ORIGINAL value.')
]);