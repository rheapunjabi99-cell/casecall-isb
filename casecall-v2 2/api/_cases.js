// CASECALL case library. Every number here is fictional and internally consistent.
// Each case has 5 stages, one per skill. `domains` = target roles it suits; `focus` = the two skills it tests hardest
// (used to recommend cases for a student's weakest skills). Rubrics and model answers stay on the server
// for the AI review; the app shows the model answer only after a student submits.

export const SKILLS = [
  "Structuring",
  "Reading exhibits",
  "Quant and maths",
  "Hypothesis-driven thinking",
  "Synthesis and recommendation",
];

export const CASES = [
  {
    id: "zipkart",
    title: "Profits down by more than half",
    company: "Zipkart",
    sector: "Quick-commerce grocery",
    type: "Profitability",
    domains: ["Consulting", "General management"],
    focus: ["Reading exhibits", "Hypothesis-driven thinking"],
    minutes: 20,
    difficulty: "Core",
    intro:
      "Zipkart is a quick-commerce grocery app in five Indian metros. Profit per order has fallen by more than half over the last two quarters, even though orders are steady. The CEO wants to know why, and what to do about it.",
    stages: [
      {
        skill: "Structuring",
        title: "Structure the problem",
        prompt: "How would you structure your approach to this problem? Walk me through it.",
        rubric: {
          strong: "Breaks profit into orders × profit per order, and profit per order into average order value × gross margin minus per-order costs (delivery, dark-store operations, discounts). Says which branches to check first and why. May ask a sharp clarifying question.",
          weak: "Recites a generic framework (4Ps, Porter's five forces) without tailoring it; lists ideas instead of a structure; jumps straight to solutions.",
        },
        model:
          "I'd split profit into orders × profit per order. Since orders are steady, I'd focus on profit per order: average order value × gross margin, minus delivery cost, dark-store cost and discounts per order. I'd check which of those moved most, starting with the cost lines.",
      },
      {
        skill: "Reading exhibits",
        title: "Read the exhibit",
        prompt: "Here's what changed between Q1 and Q3. What stands out to you?",
        exhibit: {
          title: "Exhibit 1: Zipkart unit economics, Q1 vs Q3",
          head: ["Metric", "Q1", "Q3"],
          rows: [
            ["Orders per day", "120,000", "121,000"],
            ["Average order value", "₹410", "₹380"],
            ["Gross margin", "22%", "22%"],
            ["Delivery cost per order", "₹38", "₹52"],
            ["Dark-store cost per order", "₹18", "₹16"],
            ["Discounts per order", "₹10", "₹7"],
            ["Profit per order", "₹24", "₹9"],
          ],
        },
        rubric: {
          strong: "Notices delivery cost per order rose ₹14 (about 37%), which explains most of the ₹15 fall in profit per order. Notes the lower order value costs about ₹6.6 of gross profit per order (22% of ₹30), partly offset by lower dark-store cost and discounts. Concludes delivery cost is the main driver.",
          weak: "Describes rows one by one without prioritising; focuses on orders or margin, which barely moved; misses the delivery cost jump.",
        },
        model:
          "Profit per order fell about ₹15, from ₹24 to ₹9. Delivery cost alone rose ₹14, so it's the main driver. Lower order value cost about ₹6.6 of gross profit, but cheaper dark-store operations and fewer discounts clawed back ₹5. Orders and margin are flat, so I'd dig into why delivery cost jumped.",
      },
      {
        skill: "Quant and maths",
        title: "Do the maths",
        prompt: "Quick maths: Zipkart does about 121,000 orders a day. If delivery cost per order went back to ₹38, how much extra profit would that add per month? Assume 30 days.",
        rubric: {
          strong: "₹14 × 121,000 orders × 30 days ≈ ₹5.1 crore a month (₹5.08 crore). Shows the steps, states the 30-day assumption, and sense-checks the size.",
          weak: "Wrong order of magnitude; no steps shown; uses the wrong per-order difference.",
        },
        model:
          "The saving is ₹14 an order. ₹14 × 121,000 is about ₹17 lakh a day, and × 30 days is about ₹5.1 crore a month. That's large enough to be the CEO's top priority.",
      },
      {
        skill: "Hypothesis-driven thinking",
        title: "Handle the twist",
        prompt: "Here's why delivery cost rose: partners are paid far more on rain-surge days, and Q3 was the monsoon. The client won't cut partner pay. What would you look at, and what would you do?",
        exhibit: {
          title: "Exhibit 2: Delivery partner pay",
          head: ["Item", "Value"],
          rows: [
            ["Pay per order, normal days", "₹36"],
            ["Pay per order, rain-surge days", "₹100"],
            ["Share of days with rain surge, Q1", "3%"],
            ["Share of days with rain surge, Q3", "25%"],
          ],
        },
        rubric: {
          strong: "Sees the cost spike is concentrated on surge days (25% of days at ₹100 vs ₹36). Respects the constraint and targets surge days: batching nearby orders, a small surge fee or higher minimum order on surge days, relaxing the 10-minute promise when it rains, or pre-positioning stock. Suggests testing the effect on order volume.",
          weak: "Cuts partner pay anyway (ignores the constraint); exits cities; runs discounts; treats it as a permanent all-day problem.",
        },
        model:
          "The extra cost sits almost entirely on surge days, a quarter of Q3 days. Without touching pay, I'd cut cost per order on those days: batch nearby orders, relax the 10-minute promise when it rains, and test a small surge fee or higher minimum order, watching whether order volume holds.",
      },
      {
        skill: "Synthesis and recommendation",
        title: "Recommend",
        prompt: "The CEO walks in. Give your recommendation in under a minute.",
        rubric: {
          strong: "Leads with the answer: profit per order fell from ₹24 to ₹9 mainly because monsoon surge pay pushed delivery cost from ₹38 to ₹52. Recommends surge-day actions (batching, relaxed delivery promise, small surge fee), sizes the prize at up to about ₹5 crore a month, names the main risk (lost orders) and a next step (pilot in one city).",
          weak: "Repeats the analysis without a clear recommendation; no numbers; no risks or next steps.",
        },
        model:
          "Profit per order fell from ₹24 to ₹9 because monsoon surge pay pushed delivery cost from ₹38 to ₹52. We recommend targeting surge days: batch orders, relax the 10-minute promise when it rains, and test a small surge fee. That's worth up to about ₹5 crore a month. The risk is losing orders, so we'd pilot in one city first.",
      },
    ],
  },
  {
    id: "crumb",
    title: "Should they enter Bengaluru?",
    company: "Crumb & Co",
    sector: "Premium bakery chain",
    type: "Market entry",
    domains: ["Consulting", "General management"],
    focus: ["Structuring", "Synthesis and recommendation"],
    minutes: 20,
    difficulty: "Core",
    intro:
      "Crumb & Co is a premium bakery chain with 18 stores in Pune, known for occasion cakes. The CEO says their cakes sell out and Bengaluru feels like the obvious next step. They've asked whether to enter, and how.",
    stages: [
      {
        skill: "Structuring",
        title: "Structure the problem",
        prompt: "How would you decide whether Crumb & Co should enter Bengaluru?",
        rubric: {
          strong: "Defines the goal and success measure (for example profit or payback period), then covers market attractiveness (size, growth), competition, Crumb's ability to win, the economics of a store, and the entry mode. Ends the structure with how the decision will be made.",
          weak: "Says yes because Pune is successful; lists generic factors without a decision rule; ignores how to enter.",
        },
        model:
          "First I'd agree what success means, say a payback within three years. Then four questions: is the Bengaluru market attractive, can we win against existing players, do the store economics work, and what's the right way to enter. The answer to the last two drives the recommendation.",
      },
      {
        skill: "Reading exhibits",
        title: "Read the exhibit",
        prompt: "Here's what we know about the two cities. What does it tell you?",
        exhibit: {
          title: "Exhibit 1: Pune vs Bengaluru",
          head: ["Metric", "Pune", "Bengaluru"],
          rows: [
            ["Premium cake market (per year)", "₹180 crore", "₹420 crore"],
            ["Market growth", "12%", "15%"],
            ["Established premium chains", "1 (Crumb & Co)", "3"],
            ["Average store rent (per month)", "₹2.5 lakh", "₹3.5 lakh"],
            ["Share of orders via delivery apps", "35%", "45%"],
          ],
        },
        rubric: {
          strong: "Bengaluru is over twice the size and growing faster, but has three established chains and rents 40% higher. The higher delivery share (45%) suggests a delivery-led entry could avoid some rent. Draws a 'so what' rather than restating numbers.",
          weak: "Restates every row; misses the competition or rent; concludes simply 'bigger market, so enter'.",
        },
        model:
          "Bengaluru is attractive: more than twice Pune's size and growing faster. But it's crowded, with three established chains, and rents are 40% higher. The 45% delivery share is the opening: a delivery-led entry could test demand without paying full store rents.",
      },
      {
        skill: "Quant and maths",
        title: "Do the maths",
        prompt: "A Bengaluru store would make ₹2.4 crore revenue a year at a 30% contribution margin before rent. Rent is ₹3.5 lakh a month and other fixed costs are ₹6 lakh a year. Setup costs ₹60 lakh. What's the payback period?",
        rubric: {
          strong: "Contribution = 30% × ₹2.4 crore = ₹72 lakh. Rent = ₹42 lakh a year. Profit = 72 − 42 − 6 = ₹24 lakh a year. Payback = ₹60 lakh ÷ ₹24 lakh = 2.5 years. Shows steps clearly.",
          weak: "Forgets to annualise rent; misreads crore/lakh; no steps.",
        },
        model:
          "Contribution is 30% of ₹2.4 crore, or ₹72 lakh. Rent is ₹3.5 lakh × 12 = ₹42 lakh, plus ₹6 lakh of other fixed costs, leaving ₹24 lakh a year. ₹60 lakh ÷ ₹24 lakh = a 2.5-year payback, inside a three-year target but not by much.",
      },
      {
        skill: "Hypothesis-driven thinking",
        title: "Handle the twist",
        prompt: "Two new facts: delivery-app data shows 60% of Bengaluru's occasion-cake orders come from just three neighbourhoods, and the CEO can only fund ₹1 crore this year. How does that change your approach?",
        exhibit: {
          title: "Exhibit 2: Entry options within ₹1 crore",
          head: ["Option", "Setup cost"],
          rows: [
            ["Full store", "₹60 lakh each"],
            ["Delivery-only cloud kitchen", "₹25 lakh each"],
          ],
        },
        rubric: {
          strong: "Uses the concentration: start where demand is, with cloud kitchens serving the top neighbourhoods plus at most one flagship store, all within ₹1 crore (for example one store and one cloud kitchen = ₹85 lakh). Treats it as a staged test with clear success metrics before expanding.",
          weak: "Ignores the budget (proposes several stores); ignores the neighbourhood data; abandons entry without testing.",
        },
        model:
          "Demand is concentrated, so I'd enter where it is. Within ₹1 crore: one flagship store in the strongest neighbourhood and one cloud kitchen covering the other two, about ₹85 lakh. Treat year one as a test: if orders and payback hit target, expand.",
      },
      {
        skill: "Synthesis and recommendation",
        title: "Recommend",
        prompt: "The CEO asks: should we go, yes or no? Give your recommendation.",
        rubric: {
          strong: "Clear yes, with conditions: enter in a staged, delivery-led way (one flagship plus a cloud kitchen in the top neighbourhoods) within ₹1 crore; reasons (bigger, faster-growing market; 2.5-year store payback); risks (three established chains, high rents); and the metric that decides whether to expand.",
          weak: "No clear answer; repeats analysis; ignores the budget or the risks.",
        },
        model:
          "Yes, but staged. Bengaluru is twice Pune's size and growing faster, and a store pays back in about 2.5 years. Start with one flagship and one cloud kitchen in the top neighbourhoods, within ₹1 crore. The risk is three established rivals, so expand only if year-one orders hit target.",
      },
    ],
  },
  {
    id: "paynest",
    title: "A 15% price rise?",
    company: "PayNest",
    sector: "HR software for small businesses",
    type: "Pricing",
    domains: ["Consulting", "Product management"],
    focus: ["Quant and maths", "Hypothesis-driven thinking"],
    minutes: 20,
    difficulty: "Core",
    intro:
      "PayNest sells HR and payroll software to about 2,000 small businesses on yearly plans. The CEO wants a 15% price rise for everyone. The engagement partner needs your view before the client meeting.",
    stages: [
      {
        skill: "Structuring",
        title: "Structure the problem",
        prompt: "How would you think about whether PayNest should raise prices by 15%?",
        rubric: {
          strong: "Frames it as revenue gain from the price rise versus revenue lost to extra churn, by customer segment. Considers value delivered, willingness to pay, competitors' prices and current churn. Plans to look at segments rather than the average.",
          weak: "Answers yes or no immediately; only considers cost-plus pricing; treats all customers the same.",
        },
        model:
          "The question is whether the extra revenue per customer outweighs the customers we'd lose. I'd look at it by segment: how much value each segment gets, how loyal they are today, and what competitors charge. A blanket rise may hurt some segments and be easy money in others.",
      },
      {
        skill: "Reading exhibits",
        title: "Read the exhibit",
        prompt: "Here's PayNest's customer data by segment. What do you notice?",
        exhibit: {
          title: "Exhibit 1: Customers by firm size",
          head: ["Segment", "Customers", "Price per year", "Revenue", "Monthly churn", "Satisfaction"],
          rows: [
            ["50+ employees", "500", "₹48,000", "₹2.4 crore", "0.5%", "8.6 / 10"],
            ["20–49 employees", "700", "₹15,000", "₹1.05 crore", "1.5%", "7.1 / 10"],
            ["Under 20 employees", "800", "₹6,000", "₹0.48 crore", "4%", "5.2 / 10"],
          ],
        },
        rubric: {
          strong: "The 50+ segment is 25% of customers but about 60% of revenue, and is loyal (0.5% churn) and happy (8.6). The under-20 segment is the largest by count but small in revenue, already churning 4% a month and unhappy. So a price rise fits the large firms and is risky for the small ones.",
          weak: "Lists numbers without a conclusion; averages across segments; misses the churn and satisfaction pattern.",
        },
        model:
          "The 50+ firms are only a quarter of customers but about 60% of revenue, and they're loyal and happy, so they can likely absorb a rise. The under-20 firms already churn 4% a month and rate us 5.2. A rise there would push them out. I'd raise prices selectively.",
      },
      {
        skill: "Quant and maths",
        title: "Do the maths",
        prompt: "Say you raise prices 15% only for the 50+ segment, and the higher price costs you an extra 6% of those customers over the year. What's the extra revenue in year one?",
        rubric: {
          strong: "₹2.4 crore × 1.15 = ₹2.76 crore; × 0.94 = about ₹2.59 crore; minus ₹2.4 crore baseline = about ₹19 lakh extra a year. Clear steps and a sense check.",
          weak: "Adds 15% and subtracts 6% as simple percentages without care; wrong base; no steps.",
        },
        model:
          "Their revenue is ₹2.4 crore. A 15% rise takes it to ₹2.76 crore. Losing an extra 6% of customers leaves about ₹2.59 crore. That's roughly ₹19 lakh more a year, a solid gain from the segment least likely to leave.",
      },
      {
        skill: "Hypothesis-driven thinking",
        title: "Handle the twist",
        prompt: "News just in: a competitor has launched a free plan for firms with under 20 employees. How does this change your thinking?",
        rubric: {
          strong: "Recognises the under-20 segment is now highly exposed: unhappy, high-churn and offered a free alternative. Options: a lighter, cheaper plan to retain them, or accept losing a low-revenue segment and focus on larger firms. Uses the data (₹0.48 crore at stake) to decide, and keeps the 50+ price rise.",
          weak: "Panics and drops the price rise everywhere; matches free for everyone; ignores how small that segment's revenue is.",
        },
        model:
          "It mainly threatens the under-20 segment, which is unhappy, churning and only about ₹48 lakh of revenue. I wouldn't change the 50+ plan. For small firms, I'd test a lighter plan to keep the best ones, and accept that some will leave for free.",
      },
      {
        skill: "Synthesis and recommendation",
        title: "Recommend",
        prompt: "The partner has two minutes before the client meeting. What do we recommend?",
        rubric: {
          strong: "Recommends against a blanket 15% rise. Raise prices for 50+ firms (worth about ₹19 lakh a year), hold or simplify pricing for 20–49, and respond to the free competitor with a lighter plan for under-20 firms. Names the risk (churn among large firms) and a next step (monitor churn monthly after the change).",
          weak: "Endorses the blanket rise; no numbers; no clear next step.",
        },
        model:
          "Don't raise prices for everyone. Raise them 15% for firms with 50+ employees, which are loyal and bring about 60% of revenue; that's worth about ₹19 lakh a year. Hold prices for mid-sized firms, and answer the free competitor with a lighter plan for small firms. Watch large-firm churn monthly after the change.",
      },
    ],
  },
  {
    id: "tiffin",
    title: "How big is the tiffin market?",
    company: "DabbaGo",
    sector: "Home-cooked meal delivery",
    type: "Market sizing",
    domains: ["Consulting", "Product management"],
    focus: ["Quant and maths", "Reading exhibits"],
    minutes: 15,
    difficulty: "Starter",
    intro:
      "DabbaGo is a startup delivering home-cooked tiffin meals. Before raising funds, the founder wants to know how big the market for paid tiffin meals among working professionals in Bengaluru is, and whether it's big enough for their ₹100 crore revenue goal.",
    stages: [
      {
        skill: "Structuring",
        title: "Structure the estimate",
        prompt: "How would you estimate the yearly market for paid tiffin meals among working professionals in Bengaluru?",
        rubric: {
          strong: "Builds a clear chain: working professionals → share living away from family → share using paid tiffin regularly → meals per working day → working days per year → price per meal. Explains why each step matters and how to sense-check.",
          weak: "Starts from the whole city population without filtering; mixes up yearly and daily; no clear chain.",
        },
        model:
          "I'd work top-down: start with working professionals, keep those living away from family, then the share who use a paid tiffin regularly. Multiply by meals per working day, working days a year and price per meal. Then sense-check against how many such services exist.",
      },
      {
        skill: "Reading exhibits",
        title: "Pick the right data",
        prompt: "Here are some numbers the founder found. Which ones would you use, and are any of them a trap?",
        exhibit: {
          title: "Exhibit 1: Data points",
          head: ["Data point", "Value"],
          rows: [
            ["Bengaluru population", "1.3 crore"],
            ["Working professionals in Bengaluru", "40 lakh"],
            ["Share living away from family", "50%"],
            ["Share of those using paid tiffin regularly", "15%"],
            ["Meals per user per working day", "1.5"],
            ["Working days per year", "250"],
            ["Average price per meal", "₹90"],
          ],
        },
        rubric: {
          strong: "Uses working professionals (40 lakh), not total population (the trap). Uses 50%, 15%, 1.5 meals, 250 days and ₹90. May question whether 15% and 1.5 meals are realistic.",
          weak: "Starts from 1.3 crore population; uses every number without judgement.",
        },
        model:
          "I'd skip the 1.3 crore population; that's the trap, since only working professionals matter. I'd use 40 lakh professionals, 50% living away, 15% using tiffin, 1.5 meals a day, 250 days and ₹90 a meal, while flagging that 15% usage is the assumption to test hardest.",
      },
      {
        skill: "Quant and maths",
        title: "Do the maths",
        prompt: "Now calculate the yearly market size.",
        rubric: {
          strong: "40 lakh × 50% = 20 lakh; × 15% = 3 lakh users; × 1.5 meals × 250 days = 375 meals each = 11.25 crore meals; × ₹90 ≈ ₹1,000 crore a year (₹1,012 crore).",
          weak: "Wrong order of magnitude; confuses lakh and crore; skips steps.",
        },
        model:
          "40 lakh × 50% = 20 lakh living away. 15% of those = 3 lakh users. Each eats 1.5 × 250 = 375 meals a year, so 11.25 crore meals. At ₹90 a meal, that's about ₹1,000 crore a year.",
      },
      {
        skill: "Hypothesis-driven thinking",
        title: "Handle the twist",
        prompt: "The founder adds: 30% of new users stop within three months, and most users skip weekends anyway. How does this affect your estimate and your advice?",
        rubric: {
          strong: "Weekends are already excluded (250 working days), so that's covered. High early churn means the 15% 'regular' figure may be overstated, so the true market could be meaningfully smaller; suggests testing it (for example retention data) and treating ₹1,000 crore as an upper bound.",
          weak: "Double-counts weekends; ignores churn; says the estimate doesn't change.",
        },
        model:
          "Weekends are already out, since I used 250 working days. Churn matters more: if many users drop off, the 15% 'regular' share is probably too high. I'd treat ₹1,000 crore as an upper bound and test it with retention data.",
      },
      {
        skill: "Synthesis and recommendation",
        title: "Recommend",
        prompt: "So: is this market big enough for DabbaGo's ₹100 crore revenue goal?",
        rubric: {
          strong: "₹100 crore is about 10% of an upper-bound ₹1,000 crore market. Possible but demanding, given churn and competition. Says what would need to be true (strong retention, share in key areas) and the next step (validate the usage rate).",
          weak: "Yes or no without numbers; ignores the churn caveat.",
        },
        model:
          "Possibly. ₹100 crore is about 10% of a market of up to ₹1,000 crore. That's a big share given churn and competition, so it only works with strong retention. Next step: validate how many users really stay regular.",
      },
    ],
  },
  {
    id: "snackly",
    title: "Orders fell after the redesign",
    company: "Snackly",
    sector: "Food delivery app",
    type: "Product diagnosis",
    domains: ["Product management"],
    focus: ["Reading exhibits", "Hypothesis-driven thinking"],
    minutes: 20,
    difficulty: "Core",
    intro:
      "Snackly is a food delivery app. Two weeks after launching a redesigned app, weekly orders fell sharply. The VP of Product wants to know what happened and what to do.",
    stages: [
      {
        skill: "Structuring",
        title: "Structure the problem",
        prompt: "How would you diagnose why orders fell after the redesign?",
        rubric: {
          strong: "Checks it's real (data issues, seasonality), then breaks orders into the funnel: app opens → browsing → add to cart → checkout completion. Segments by platform (Android/iOS), app version and user type to find where the drop sits.",
          weak: "Jumps to a cause (e.g. 'users dislike the new design') without a diagnostic path; no funnel or segments.",
        },
        model:
          "First I'd rule out data issues or a seasonal dip. Then I'd walk the funnel, opens to browsing to cart to checkout, and split it by platform, app version and new vs repeat users, to find exactly where the drop happens.",
      },
      {
        skill: "Reading exhibits",
        title: "Read the exhibit",
        prompt: "Here's the funnel before and after the redesign. Where is the problem?",
        exhibit: {
          title: "Exhibit 1: Funnel, before vs after",
          head: ["Step", "Before", "After"],
          rows: [
            ["App opens per user per week", "3.2", "3.1"],
            ["Menu views per open", "2.4", "2.3"],
            ["Add-to-cart rate", "38%", "37%"],
            ["Checkout completion", "82%", "64%"],
            ["Checkout completion, Android", "82%", "58%"],
            ["Checkout completion, iOS", "82%", "80%"],
          ],
        },
        rubric: {
          strong: "The top of the funnel barely moved; the drop is at checkout (82% → 64%), and it's concentrated on Android (82% → 58%) while iOS is almost unchanged. Points to an Android checkout issue.",
          weak: "Reads every row equally; blames browsing or app opens; misses the Android split.",
        },
        model:
          "Everything before checkout is roughly flat. The drop is at checkout, from 82% to 64%, and it's almost all on Android, down to 58%, while iOS barely moved. So it's an Android checkout problem, not a design-wide one.",
      },
      {
        skill: "Quant and maths",
        title: "Do the maths",
        prompt: "Before the redesign, Snackly had 1.4 million weekly Android orders at 82% checkout completion. If completion is now 58%, how many Android orders are lost each week?",
        rubric: {
          strong: "Checkouts started = 1.4M ÷ 0.82 ≈ 1.71M. Orders now = 1.71M × 0.58 ≈ 0.99M. Lost ≈ 0.41 million (about 4 lakh) orders a week. Clear steps.",
          weak: "Subtracts percentages directly (24% × 1.4M); wrong base; no steps.",
        },
        model:
          "1.4 million orders at 82% means about 1.71 million checkouts started. At 58%, that's about 0.99 million orders, so roughly 410,000 Android orders lost every week.",
      },
      {
        skill: "Hypothesis-driven thinking",
        title: "Handle the twist",
        prompt: "Engineering tells you the new Android checkout added a mandatory step asking users to re-confirm their delivery address. What now?",
        rubric: {
          strong: "Strong hypothesis that the extra step causes the drop. Proposes a quick test (roll back or make it optional for a share of Android users) and checks if completion recovers; considers why the step was added (e.g. wrong-address deliveries) and a smarter version (only ask when the location looks wrong).",
          weak: "Rolls back everything without checking; ignores why the step exists; no test.",
        },
        model:
          "That's the likely culprit. I'd test it: make the step optional for half of Android users and see if completion recovers. I'd also ask why it was added. If it cut wrong-address deliveries, I'd only ask when the location looks wrong.",
      },
      {
        skill: "Synthesis and recommendation",
        title: "Recommend",
        prompt: "The VP of Product asks for your recommendation. Go.",
        rubric: {
          strong: "Leads with the cause (Android checkout's new address step), the size (about 410,000 lost orders a week), the action (test making the step optional or conditional, then roll out), the risk (more wrong-address deliveries) and the success metric (Android completion back above 80%).",
          weak: "No clear cause or action; no numbers; vague 'improve the design'.",
        },
        model:
          "The drop comes from the new address step in Android checkout; we're losing about 410,000 orders a week. Test making it conditional for half of Android users this week, and roll out if completion gets back above 80%. Watch wrong-address deliveries as the risk.",
      },
    ],
  },
  {
    id: "sahyog",
    title: "Waiting times have doubled",
    company: "Sahyog Hospital",
    sector: "Multi-speciality hospital",
    type: "Operations",
    domains: ["Consulting", "General management"],
    focus: ["Structuring", "Quant and maths"],
    minutes: 20,
    difficulty: "Stretch",
    intro:
      "Sahyog is a busy hospital in Pune. Average waiting time in its outpatient department has doubled to about 90 minutes in the past year, and patient complaints are rising. The hospital's COO wants to know why, and what to do.",
    stages: [
      {
        skill: "Structuring",
        title: "Structure the problem",
        prompt: "How would you structure this problem?",
        rubric: {
          strong: "Treats it as demand vs capacity across the patient journey: arrival → registration → (triage) → consultation → billing/pharmacy. Checks where the queue builds, and whether demand rose, capacity fell or arrivals bunched up.",
          weak: "Lists ideas (hire doctors, build an app) without a structure; ignores the patient journey.",
        },
        model:
          "Waiting time comes from demand exceeding capacity somewhere in the patient journey: arrival, registration, consultation, billing. I'd find which step the queue builds at, then check whether demand grew, capacity fell, or arrivals bunch into peaks.",
      },
      {
        skill: "Reading exhibits",
        title: "Read the exhibit",
        prompt: "Here's the outpatient data from last year and this year. What stands out?",
        exhibit: {
          title: "Exhibit 1: Outpatient department",
          head: ["Metric", "Last year", "This year"],
          rows: [
            ["Patients per day", "600", "750"],
            ["Doctors in outpatients", "15", "15"],
            ["Consulting hours per doctor per day", "6", "6"],
            ["Average consultation", "8 min", "8 min"],
            ["Share arriving 9–11 am", "30%", "45%"],
            ["Share of visits that are follow-ups", "30%", "30%"],
          ],
        },
        rubric: {
          strong: "Demand rose 25% (600 → 750) with no change in doctors or consult time, and arrivals are far more bunched (45% in two morning hours). Follow-ups are 30% of visits, a possible lever.",
          weak: "Restates rows; misses the peak bunching or the demand rise.",
        },
        model:
          "Two things changed: patients rose 25% to 750 a day with the same 15 doctors, and arrivals got far more bunched, with 45% now coming between 9 and 11. Follow-ups are 30% of visits, which could be handled differently.",
      },
      {
        skill: "Quant and maths",
        title: "Do the maths",
        prompt: "With 15 doctors each consulting 6 hours a day at 8 minutes per patient, what's the daily capacity? How does it compare with 750 patients?",
        rubric: {
          strong: "6 hours = 360 minutes ÷ 8 = 45 patients per doctor; × 15 = 675 a day. That's 75 short of 750 (about 10%), whereas last year's 600 fitted. Explains why the queue grows through the day.",
          weak: "Arithmetic errors; doesn't compare with demand.",
        },
        model:
          "Each doctor sees 360 ÷ 8 = 45 patients a day, so 15 doctors handle 675. Demand is 750, about 75 more than capacity, so the queue grows every day. Last year's 600 fitted comfortably.",
      },
      {
        skill: "Hypothesis-driven thinking",
        title: "Handle the twist",
        prompt: "The COO says hiring doctors takes six months, and the budget this year only covers admin staff and technology. What would you do?",
        rubric: {
          strong: "Frees doctor time and flattens peaks without hiring: timed appointments or slot booking to spread arrivals; nurse-led or shorter follow-up visits (30% of visits) to recover capacity; online pre-registration. Rough sizing, e.g. halving follow-up time (225 follow-ups × 4 minutes saved) frees about 900 doctor-minutes, enough to close the 75-patient gap.",
          weak: "Insists on hiring doctors; generic 'build an app'; no link to the numbers.",
        },
        model:
          "Without new doctors, I'd free doctor time and spread the peak. Book timed slots so arrivals don't bunch at 9. Run follow-ups, 30% of visits, as shorter 4-minute or nurse-led visits; that frees about 900 doctor-minutes a day, roughly 110 slots, enough to cover the 75-patient gap.",
      },
      {
        skill: "Synthesis and recommendation",
        title: "Recommend",
        prompt: "Give the COO your recommendation.",
        rubric: {
          strong: "Leads with the cause (25% more patients against flat capacity of 675 a day, plus bunched mornings), the actions (timed slots, shorter or nurse-led follow-ups, online pre-registration), the expected effect (close the 75-patient gap), the risk (care quality for follow-ups) and the next step (pilot in one department, then hire doctors in six months).",
          weak: "No clear cause; long list of ideas without priority; no numbers.",
        },
        model:
          "Waiting doubled because demand grew 25% to 750 a day while capacity stayed at 675, and arrivals bunched into the morning. Introduce timed slots and shorter follow-ups to close the gap now, pilot in one department, and hire doctors when budget allows. Monitor care quality on follow-ups.",
      },
    ],
  },
  {
    id: "kosh",
    title: "Which feature ships next?",
    company: "Kosh",
    sector: "Personal finance app",
    type: "Prioritisation",
    domains: ["Product management"],
    focus: ["Structuring", "Synthesis and recommendation"],
    minutes: 20,
    difficulty: "Core",
    intro:
      "Kosh is a personal finance app with 4 million monthly users who use it to pay bills and track spending. This year's goal is to grow monthly revenue. Engineering can build one big feature next quarter, and the Head of Product wants you to pick it from three candidates.",
    stages: [
      {
        skill: "Structuring",
        title: "Structure the decision",
        prompt: "How would you decide which feature Kosh should build next?",
        rubric: {
          strong: "Anchors on the goal (monthly revenue, without hurting user trust). Sets clear criteria: how many users each feature reaches, revenue or value per user, confidence in those estimates, and engineering effort, so features can be compared on expected impact per week of effort (a RICE-style approach). Also checks strategic fit and risks such as regulation for lending.",
          weak: "Picks a favourite feature straight away; lists pros and cons without criteria; ignores the revenue goal or the effort each feature needs.",
        },
        model:
          "I'd start from the goal: grow monthly revenue without hurting trust. For each feature I'd estimate how many users it reaches, revenue per user, how confident we are in those numbers, and the engineering weeks it needs. Then I'd compare expected impact per week of effort, and check risks like lending regulation.",
      },
      {
        skill: "Reading exhibits",
        title: "Read the exhibit",
        prompt: "Here are the three features the team has scoped. What stands out?",
        exhibit: {
          title: "Exhibit 1: Feature candidates",
          head: ["Feature", "Users reached per month", "Revenue per user reached per month", "Confidence in estimate", "Engineering effort"],
          rows: [
            ["A. Credit card bill reminders with autopay", "12 lakh", "₹5", "High (80%)", "6 weeks"],
            ["B. Small instant loans via a partner NBFC", "3 lakh", "₹40", "Low (40%)", "12 weeks"],
            ["C. Gold savings round-ups", "6 lakh", "₹8", "Medium (60%)", "6 weeks"],
          ],
        },
        rubric: {
          strong: "Notices that loans have the biggest headline revenue (3 lakh × ₹40 = ₹1.2 crore a month vs ₹60 lakh for reminders and ₹48 lakh for gold) but the lowest confidence and twice the effort. After adjusting for confidence, reminders and loans both come to about ₹48 lakh, so reminders look better once effort is counted.",
          weak: "Picks loans because of the high revenue per user, or reminders because of reach alone; ignores confidence or effort; reads rows out without comparing them.",
        },
        model:
          "Loans look biggest on paper: 3 lakh users × ₹40 is ₹1.2 crore a month, against ₹60 lakh for reminders. But loans have the lowest confidence and take twice as long to build. Adjusted for confidence, both come to about ₹48 lakh, so reminders should win once we count effort.",
      },
      {
        skill: "Quant and maths",
        title: "Do the maths",
        prompt: "Work out each feature's confidence-adjusted monthly revenue per week of engineering effort. Which one wins, and by how much?",
        rubric: {
          strong: "Reminders: 12 lakh × ₹5 × 80% = ₹48 lakh, ÷ 6 weeks = ₹8 lakh per week. Loans: 3 lakh × ₹40 × 40% = ₹48 lakh, ÷ 12 = ₹4 lakh per week. Gold: 6 lakh × ₹8 × 60% = ₹28.8 lakh, ÷ 6 = ₹4.8 lakh per week. Reminders win, about 1.7 times gold and twice loans. Shows the steps.",
          weak: "Skips the confidence adjustment or the effort division; lakh and crore mix-ups; no clear winner stated.",
        },
        model:
          "Reminders: 12 lakh × ₹5 × 0.8 is ₹48 lakh a month, over 6 weeks that's ₹8 lakh per week. Loans: 3 lakh × ₹40 × 0.4 is also ₹48 lakh, but over 12 weeks it's ₹4 lakh per week. Gold: ₹28.8 lakh over 6 weeks, ₹4.8 lakh per week. Reminders win, about twice loans.",
      },
      {
        skill: "Hypothesis-driven thinking",
        title: "Handle the twist",
        prompt: "The CEO pushes back: a competitor just launched instant loans and she's worried users will leave. The partner NBFC also says compliance checks will add 8 weeks to the loan feature. What do you do?",
        rubric: {
          strong: "Treats the CEO's fear as a hypothesis to test (are users who look for credit actually leaving for the competitor? check churn and search data). Updates the maths: loans now take about 20 weeks, so roughly ₹2.4 lakh per week and little revenue this year. Recommends building reminders now while starting the NBFC compliance work in parallel, and testing real loan demand cheaply with a waitlist.",
          weak: "Switches to loans because the CEO said so, with no evidence; or dismisses the competitive threat completely; ignores the extra 8 weeks.",
        },
        model:
          "I'd test the fear first: are users who search for credit actually leaving for the competitor? With compliance, loans take about 20 weeks, roughly ₹2.4 lakh per week, so they'd add little this year. I'd build reminders now, start NBFC compliance in parallel, and run a loan waitlist to measure real demand.",
      },
      {
        skill: "Synthesis and recommendation",
        title: "Recommend",
        prompt: "The Head of Product needs a one-minute answer for the leadership meeting. Go.",
        rubric: {
          strong: "Leads with the answer: build credit card reminders with autopay. Gives the reasons with numbers (about ₹48 lakh a month expected, about ₹8 lakh per engineering week, twice the alternatives; loans now about 20 weeks with compliance). Addresses the competitor worry (start compliance and a waitlist in parallel). Names a risk (notification fatigue or low autopay take-up) and a next step (launch to 10% of users and track autopay sign-ups).",
          weak: "Walks through all three features without a clear pick; no numbers; ignores the CEO's concern; no risk or next step.",
        },
        model:
          "Build credit card reminders with autopay. It should add about ₹48 lakh a month for six weeks of work, twice the return per week of loans, which now need about 20 weeks with compliance. To cover the competitor, we start loan compliance and a waitlist in parallel. The risk is notification fatigue, so we launch to 10% of users first and track autopay sign-ups.",
      },
    ],
  },
  {
    id: "preppal",
    title: "Roll out the AI tutor?",
    company: "PrepPal",
    sector: "Test-prep app",
    type: "Experiment readout",
    domains: ["Product management"],
    focus: ["Reading exhibits", "Synthesis and recommendation"],
    minutes: 20,
    difficulty: "Stretch",
    intro:
      "PrepPal is a test-prep app for engineering entrance exams, with 20 lakh monthly users and a paid plan at ₹500 a month. For four weeks, half of new users got a new AI doubt-solver. The Head of Growth loves the early numbers and wants to roll it out to everyone. She wants your view first.",
    stages: [
      {
        skill: "Structuring",
        title: "Structure the decision",
        prompt: "How would you decide whether to roll the AI tutor out to everyone?",
        rubric: {
          strong: "Names the goal metric (paid conversion and net revenue), supporting metrics (engagement) and guardrails (refunds, answer accuracy, AI cost per user). Checks the test is trustworthy (random split, enough users, long enough to get past novelty). Ends with a decision rule, such as roll out only if net revenue rises and guardrails hold.",
          weak: "Looks only at engagement or usage; says roll out because AI is the trend; no guardrails; no check on the test itself.",
        },
        model:
          "I'd agree the goal first: more paid users and more net revenue. Engagement is a supporting signal. Guardrails are refunds, answer accuracy and AI cost per user. I'd check the test was a clean random split and long enough to get past novelty, then roll out only if net revenue goes up and the guardrails hold.",
      },
      {
        skill: "Reading exhibits",
        title: "Read the exhibit",
        prompt: "Here are the test results. What do they tell you?",
        exhibit: {
          title: "Exhibit 1: Four-week test, new users",
          head: ["Metric", "Control (no AI tutor)", "Test (AI tutor)"],
          rows: [
            ["New users in group", "1,00,000", "1,00,000"],
            ["Daily active, share of new users", "30%", "38%"],
            ["Paid within 4 weeks", "5.0%", "6.0%"],
            ["Refund requests, share of paid users", "4%", "10%"],
            ["Doubts asked per paying user per month", "None", "60"],
            ["AI cost per doubt", "None", "₹2"],
          ],
        },
        rubric: {
          strong: "Sees the good news (engagement 30% to 38%, paid conversion up a point, a 20% relative lift) and then the red flags: refunds jumped from 4% to 10% of paid users, and the AI costs about ₹120 per paying user a month (60 × ₹2) against a ₹500 price. Concludes the headline lift may not survive refunds and cost.",
          weak: "Celebrates engagement and conversion and stops there; misses the refund jump or the AI cost.",
        },
        model:
          "The tutor lifts engagement from 30% to 38% and paid conversion from 5% to 6%. But refunds jumped from 4% to 10% of paid users, and each paying user costs about ₹120 a month in AI (60 doubts × ₹2) on a ₹500 plan. I'd want net revenue before calling it a win.",
      },
      {
        skill: "Quant and maths",
        title: "Do the maths",
        prompt: "Per 1,00,000 new users, compare monthly net revenue in each group. A refunded user pays nothing, and the AI cost applies to everyone who paid, including those who later got a refund.",
        rubric: {
          strong: "Control: 5,000 paid, 4% refunded = 200, so 4,800 × ₹500 = ₹24 lakh. Test: 6,000 paid, 10% refunded = 600, so 5,400 × ₹500 = ₹27 lakh, minus AI cost 6,000 × 60 × ₹2 = ₹7.2 lakh, leaves ₹19.8 lakh. The tutor loses about ₹4.2 lakh per 1,00,000 new users a month (about 17% less).",
          weak: "Compares gross revenue only (₹30 lakh vs ₹25 lakh) and calls the test a win; forgets refunds or AI cost; arithmetic slips.",
        },
        model:
          "Control: 5,000 pay, 200 get refunds, so 4,800 × ₹500 is ₹24 lakh. Test: 6,000 pay, 600 get refunds, so 5,400 × ₹500 is ₹27 lakh, minus ₹7.2 lakh of AI cost (6,000 × 60 × ₹2), leaving ₹19.8 lakh. The tutor is about ₹4.2 lakh worse per 1,00,000 new users each month.",
      },
      {
        skill: "Hypothesis-driven thinking",
        title: "Handle the twist",
        prompt: "The team pulls refund reasons: 70% of refunds in the test group cite wrong answers from the AI tutor, mostly on physics numericals. The Head of Growth asks: can we fix this and still launch?",
        rubric: {
          strong: "Forms a clear hypothesis: refunds come from wrong answers in one area, so fix accuracy there (route physics numericals to human experts or add checking, show when the tutor is unsure). Also spots that even if refunds fall back to 4%, net revenue would be about ₹21.6 lakh (5,760 × ₹500 minus ₹7.2 lakh), still below ₹24 lakh, so AI cost per paying user must also come down by about a third (a cheaper model for easy doubts, a cap on free doubts, cached answers). Proposes a second test with refund and cost guardrails before any full rollout.",
          weak: "Kills the feature outright; or launches anyway hoping refunds fall; fixes accuracy but misses that cost is also a problem.",
        },
        model:
          "My hypothesis is that wrong physics answers drive the refunds, so I'd route physics numericals to human experts and flag low-confidence answers. But even at 4% refunds, net revenue is about ₹21.6 lakh, still below ₹24 lakh, so AI cost must fall about a third too: a cheaper model for easy doubts or a monthly cap. Then I'd re-test before any rollout.",
      },
      {
        skill: "Synthesis and recommendation",
        title: "Recommend",
        prompt: "Give the Head of Growth your recommendation in under a minute.",
        rubric: {
          strong: "Leads with a clear call: don't roll out to everyone yet. Reasons with numbers: conversion rises 5% to 6%, but refunds 4% to 10% and about ₹120 of AI cost per paying user mean about ₹4.2 lakh less net revenue per 1,00,000 new users a month. Plan: fix physics accuracy, cut AI cost per user by about a third, re-test for four weeks with refund and cost guardrails. Names a risk (a competitor ships first, or the lift was partly novelty) and a next step.",
          weak: "Says yes because engagement rose, or no without numbers; no plan to fix it; no risks.",
        },
        model:
          "Don't roll out yet. The tutor lifts conversion from 5% to 6%, but refunds jump to 10% and AI costs ₹120 per payer, so we earn about ₹4.2 lakh less per 1,00,000 new users each month. Fix physics accuracy, cut AI cost per user by a third, then re-test for four weeks with refund and cost guardrails. The risk is a competitor launching first, so we move fast.",
      },
    ],
  },
  {
    id: "saffron",
    title: "Your first 90 days as GM",
    company: "Saffron Foods",
    sector: "Packaged spices (FMCG)",
    type: "Business unit turnaround",
    domains: ["General management", "Consulting"],
    focus: ["Hypothesis-driven thinking", "Synthesis and recommendation"],
    minutes: 20,
    difficulty: "Stretch",
    intro:
      "You've just been made general manager of Saffron Foods' ₹600 crore spices business, which sells packaged spices and masala mixes across North India, mostly through kirana stores. Revenue has been flat for two years while the category grew about 10% a year. The CEO wants your plan within 90 days.",
    stages: [
      {
        skill: "Structuring",
        title: "Structure the problem",
        prompt: "How would you work out why the business is stuck while the category grows?",
        rubric: {
          strong: "Breaks revenue growth down by where (channels: kirana, modern trade, e-commerce and quick commerce; regions), what (products and pack sizes), and why (distribution reach, price points, retailer margins, marketing, competition). Sets a goal (at least grow with the category) and includes people: talking to the sales team, distributors and retailers in the first weeks.",
          weak: "A generic SWOT; jumps straight to an ad campaign or price cut; looks only at the total revenue number.",
        },
        model:
          "I'd break growth down by channel, region and product to find where we're losing ground, then ask why: distribution reach, price points, retailer margins, marketing or a new competitor. In the first weeks I'd spend time with the sales team, distributors and kirana owners. The goal is to at least grow with the category.",
      },
      {
        skill: "Reading exhibits",
        title: "Read the exhibit",
        prompt: "Here's revenue by channel. What stands out?",
        exhibit: {
          title: "Exhibit 1: Revenue by channel",
          head: ["Channel", "Share of category sales", "Category growth per year", "Saffron revenue, 2 years ago", "Saffron revenue, now"],
          rows: [
            ["Kirana stores", "70%", "5%", "₹540 crore", "₹510 crore"],
            ["Modern trade", "18%", "14%", "₹45 crore", "₹54 crore"],
            ["E-commerce and quick commerce", "12%", "40%", "₹15 crore", "₹36 crore"],
            ["Total", "100%", "About 10%", "₹600 crore", "₹600 crore"],
          ],
        },
        rubric: {
          strong: "Notices the flat total hides two opposite stories. Kirana is 85% of Saffron's revenue (₹510 of ₹600 crore) and fell ₹30 crore while that channel grew 5% a year, so Saffron is losing share in its core channel. Online more than doubled (₹15 to ₹36 crore) but is only 6% of revenue. Concludes the core problem is kirana, not a lack of online presence.",
          weak: "Says revenue is flat and moves on; focuses only on fast online growth and misses the kirana decline.",
        },
        model:
          "The flat total hides two stories. Kirana is 85% of our revenue and fell ₹30 crore while that channel grew 5% a year, so we're losing share where it matters most. Online more than doubled, but it's only 6% of revenue. The core problem looks like kirana, not online.",
      },
      {
        skill: "Quant and maths",
        title: "Do the maths",
        prompt: "If Saffron had simply grown with the category in each channel over the two years, what would revenue be today? Where is the gap?",
        rubric: {
          strong: "Kirana: ₹540 crore × 1.05 × 1.05 ≈ ₹595 crore. Modern trade: ₹45 crore × 1.14 × 1.14 ≈ ₹58.5 crore. Online: ₹15 crore × 1.4 × 1.4 ≈ ₹29.4 crore. Total ≈ ₹683 crore, so the gap is about ₹83 crore. Nearly all of it is kirana (about ₹85 crore behind); modern trade is slightly behind and online is actually ahead of the category.",
          weak: "Applies 10% to the total only (₹726 crore) and misses the channel story; compounding errors; no conclusion on where the gap sits.",
        },
        model:
          "Kirana: 540 × 1.05 × 1.05 is about ₹595 crore. Modern trade: 45 × 1.14² is about ₹58.5 crore. Online: 15 × 1.4² is about ₹29.4 crore. That's about ₹683 crore, so we're roughly ₹83 crore short. Almost all of it is kirana, about ₹85 crore behind. Online is actually ahead of the category.",
      },
      {
        skill: "Hypothesis-driven thinking",
        title: "Handle the twist",
        prompt: "Distributors tell you a rival launched ₹10 sachets two years ago and gives kirana owners 2 points more margin. Your sales head wants a 10% price cut across the range. The business makes a 12% operating margin. What do you do?",
        rubric: {
          strong: "Forms a hypothesis: Saffron is losing kirana because of small price-point packs and retailer margin, not its shelf price. Sizes the price cut: 10% of ₹600 crore is about ₹60 crore at the same volume, against operating profit of about ₹72 crore (12% × ₹600 crore), and it doesn't fix the cause. Proposes launching ₹10 sachets and adding 2 points of retailer margin on key products in kirana (about ₹10 crore on ₹510 crore), tested in one state first, with the sales head owning the pilot.",
          weak: "Accepts the across-the-board price cut; ignores the competitor's sachets; overrules the sales head without bringing them along.",
        },
        model:
          "My hypothesis is we're losing kirana on pack size and retailer margin, not shelf price. A 10% cut would cost about ₹60 crore of our roughly ₹72 crore operating profit and still miss the cause. Instead I'd launch ₹10 sachets and add 2 points of kirana margin on key products, about ₹10 crore, piloted in one state with the sales head owning it.",
      },
      {
        skill: "Synthesis and recommendation",
        title: "Recommend",
        prompt: "The CEO asks for your 90-day plan in one minute.",
        rubric: {
          strong: "Leads with the diagnosis: flat because Saffron is about ₹85 crore behind the category in kirana, likely lost to a rival's ₹10 sachets and better retailer margins, not because of online (which is ahead). Plan: launch sachets, add 2 points of margin on key kirana products (about ₹10 crore), pilot in one state for 8 to 12 weeks led by the sales head, keep investing online. Rejects the blanket price cut (about ₹60 crore of ₹72 crore profit). Names a risk (sachets cannibalising larger packs) and how to track the pilot (rate of sale, stores stocking).",
          weak: "No clear diagnosis; a long list of ideas; agrees to the price cut; no numbers, risks or next steps.",
        },
        model:
          "We're flat because we're about ₹85 crore behind the category in kirana, likely lost to a rival's ₹10 sachets and better retailer margin. Online is fine. In 90 days we launch sachets and add 2 points of kirana margin on key products, about ₹10 crore, piloted in one state with the sales head leading. We won't do a blanket price cut, which would wipe out most of our ₹72 crore profit. The risk is sachets eating into bigger packs, so we'll track rate of sale closely.",
      },
    ],
  },
];

export function publicCase(c) {
  return {
    id: c.id, title: c.title, company: c.company, sector: c.sector, type: c.type,
    domains: c.domains || [], focus: c.focus || [], minutes: c.minutes, difficulty: c.difficulty, intro: c.intro,
    custom: !!c.custom,
    stages: c.stages.map((s) => ({ skill: s.skill, title: s.title, prompt: s.prompt, exhibit: s.exhibit || null })),
  };
}

export function findCase(id) {
  return CASES.find((c) => c.id === id) || null;
}

// The case behind an attempt: a library case, or the AI-built case stored on the attempt itself.
export function caseForAttempt(attempt) {
  if (attempt && attempt.custom_case && attempt.custom_case.stages) return { ...attempt.custom_case, id: "custom", custom: true };
  return findCase(attempt && attempt.case_id);
}
