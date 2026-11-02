/* Inference learning lab: do first, see it, then read why.
   Labs live in learning-labs.js. Progress is stored in this browser only.
   Public prices and product facts were checked on 2 November 2026 from the linked pages. */
window.LEARNING_PLAN = {
  updated: "2 November 2026",
  lessons: [
    {
      id: "economics",
      title: "Where the money goes",
      short: "Cost per token, utilisation and margin",
      minutes: 25,
      labs: ["unit-economics", "utilisation-day"],
      doThis: [
        "In the first lab, drag utilisation down to 20%, then up to 90%. Watch the margin dot move along the curve.",
        "Switch the tier to Priority ×1.75. Notice how much more margin a premium tier buys without touching the GPUs.",
        "Drop tokens per second to 1,000. This is a bigger, slower model. See where break even jumps to.",
        "In the second lab, set capacity to 70%, then 120% of peak. Then fill idle time with batch work."
      ],
      notice: [
        "Cost per token is not a fixed number. Utilisation changes it more than almost anything else.",
        "Too little capacity loses demand at the peaks. Too much leaves paid GPUs idle. There is no setting that does both well, which is why tiers exist.",
        "Batch work that can wait turns idle, already paid capacity into revenue."
      ],
      explain: [
        "A GPU costs the same per hour whether it is busy or not. So the real cost of a token is the hourly GPU cost divided by the tokens it actually delivered in that hour. Halve the utilisation and you double the cost of every token.",
        "That is the core of the business. Mistral publishes a price per million tokens, but pays for GPUs by the hour, or buys them up front. Gross margin is the gap between the two, and it depends on keeping GPUs busy with work customers pay for.",
        "Pricing tools are really capacity tools. Batch fills the troughs, so it can be cheaper. Priority promises access at the peaks, so it costs more. Mistral's Priority Tier is 1.75× list price with a 99.5% uptime SLA. Regional endpoints add 10%, because they constrain where work can run. Prompt caching takes up to 90% off repeated input, because that work has already been done.",
        "Serverless pay per token and dedicated endpoints split the utilisation risk differently. With serverless, the provider carries the risk across many customers. With a dedicated endpoint, the customer pays for reserved capacity whether they use it or not."
      ],
      check: [
        { q: "GPU cost $3 an hour, 3,000 tokens per second, 50% utilisation. Roughly what does a million tokens cost to serve?", a: "3 ÷ (3,000 × 3,600 × 0.5) × 1,000,000 ≈ $0.56. At 100% utilisation it would be about $0.28." },
        { q: "Why can a batch tier be cheaper and still be good business?", a: "It runs in capacity that would otherwise sit idle between peaks. That capacity is already paid for, so almost any price above zero adds margin." },
        { q: "A dedicated endpoint runs at 30% utilisation. Whose problem is that?", a: "The customer's. They reserved the capacity. That is why dedicated is priced on capacity, and why it suits steady, predictable workloads." },
        { q: "Why does Priority Tier fall back to Standard rather than fail?", a: "Customers would rather get a slower answer than an error. The fallback protects the experience, and the response tells them which tier served them." }
      ],
      sources: [
        { t: "Mistral API pricing", u: "https://docs.mistral.ai/inference/pricing", n: "List prices, including cached input. Mistral Large 4 is $0.70 input and $2.10 output per million tokens." },
        { t: "Mistral Priority Tier", u: "https://docs.mistral.ai/inference/priority-tier", n: "1.75× pricing, 99.5% uptime SLA, fallback to Standard, comparison with Batch." },
        { t: "Mistral regional inference", u: "https://docs.mistral.ai/inference/regional-inference", n: "EU and US endpoints at 1.1×. Note the control plane is not regional." },
        { t: "Artificial Analysis", u: "https://artificialanalysis.ai/", n: "Compare price and speed across inference providers." },
        { t: "RunPod GPU pricing", u: "https://www.runpod.io/pricing", n: "Public hourly GPU prices to test the calculator against." }
      ]
    },
    {
      id: "request",
      title: "What happens when you send a prompt",
      short: "Prefill, decode and the two latencies",
      minutes: 15,
      labs: ["prefill-decode"],
      doThis: [
        "Press Send with the defaults and watch the prompt light up all at once, then the answer appear token by token.",
        "Push the prompt to 128,000 tokens. Send again. Watch the wait before the first token.",
        "Now set a short prompt and a 2,000 token answer. Watch where the time goes instead."
      ],
      notice: [
        "Long prompts hurt the wait before anything appears. Long answers hurt the total time.",
        "The answer arrives at a steady pace however long the prompt was."
      ],
      explain: [
        "Every request has two phases. Prefill reads the whole prompt in one go. The GPU processes all those tokens in parallel, so it is fast per token and limited by raw compute.",
        "Decode then writes the answer one token at a time, because each new token depends on the one before. For every single token, the GPU has to read the model's weights from memory. That makes decode limited by memory bandwidth, and much slower per token.",
        "So there are two latencies users feel. Time to first token comes from queueing plus prefill, and grows with prompt length. Time per output token comes from decode, and sets the reading speed. Retrieval, long system prompts and chat history all push time to first token up.",
        "This is also why output tokens are priced higher than input tokens. Each output token ties up the GPU for a decode step, while input tokens are processed together."
      ],
      check: [
        { q: "Users complain the assistant takes four seconds to start answering. What do you look at first?", a: "Queueing and prompt length. Check how much retrieved context and chat history is being sent, and whether requests are waiting for capacity." },
        { q: "Why are output tokens more expensive than input tokens?", a: "Decode produces one token per pass and each pass reads all the weights, so output tokens use far more GPU time each than input tokens processed together in prefill." }
      ],
      sources: [
        { t: "NVIDIA, Mastering LLM techniques: inference optimisation", u: "https://developer.nvidia.com/blog/mastering-llm-techniques-inference-optimization/", n: "Prefill and decode, and why decode is memory bound." },
        { t: "DeepLearning.AI, Efficiently Serving LLMs", u: "https://www.deeplearning.ai/short-courses/efficiently-serving-llms/", n: "Short course covering the same ideas hands on." }
      ]
    },
    {
      id: "memory",
      title: "Why GPUs run out of room",
      short: "Weights, KV cache and concurrency",
      minutes: 20,
      labs: ["gpu-memory"],
      doThis: [
        "Start with the ~7B model on one H100. Slide context up to 131,072 tokens and watch the squares turn red.",
        "Switch the KV cache to FP8. See how many requests come back.",
        "Pick the ~123B model on one H100. It will not fit. Add GPUs and change weight precision until it does."
      ],
      notice: [
        "The weights are fixed. The KV cache grows with every token of context, for every request in flight.",
        "Long context is expensive mainly because it takes memory that other users could have had."
      ],
      explain: [
        "A GPU's memory holds three things: the model weights, the KV cache and some working space. Weights are easy: parameters times bytes per parameter. A 7B model at FP16 is about 14.6 GB.",
        "The KV cache stores attention keys and values for every token already seen, so they are not recomputed at each step. Per token it is 2 × layers × KV heads × head size × bytes. For a Mistral 7B style model that is 2 × 32 × 8 × 128 × 2 bytes, about 128 KB per token. A single 32,000 token conversation needs around 4 GB.",
        "So the number of requests a GPU can serve at once is roughly the free memory after the weights, divided by the KV cache each request needs. Long context, more users and bigger models all compete for the same space.",
        "The levers are quantisation (smaller weights or KV cache), more GPUs splitting the model, shorter context, and smarter memory management such as vLLM's PagedAttention, which wastes less of the KV cache space."
      ],
      check: [
        { q: "Why does serving a 128k context model cost more than an 8k one, even for short prompts?", a: "Capacity has to be planned for the context you allow. Reserving room for long contexts means fewer concurrent requests per GPU, so a higher cost per token." },
        { q: "Name three ways to fit more requests on the same GPUs.", a: "Quantise the KV cache or weights, cap or tier context length, and use paged KV memory management. Adding GPUs works too, at a cost." }
      ],
      sources: [
        { t: "Mistral 7B paper", u: "https://arxiv.org/abs/2310.06825", n: "Architecture table: 32 layers, 8 KV heads, head size 128." },
        { t: "PagedAttention paper (vLLM)", u: "https://arxiv.org/abs/2309.06180", n: "Why KV cache memory is wasted, and how paging fixes it." },
        { t: "vLLM documentation", u: "https://docs.vllm.ai/", n: "The serving engine Mistral recommends for self-deployment." }
      ]
    },
    {
      id: "batching",
      title: "Cheaper tokens or faster users",
      short: "Batching and the throughput trade-off",
      minutes: 15,
      labs: ["batching"],
      doThis: [
        "Move the batch from 1 to 256. Watch the two dots move in opposite directions.",
        "Watch the cost per million tokens as the batch grows. Find the point where it stops falling much.",
        "Pick the batch size you would use for a chat product, and one for a batch tier."
      ],
      notice: [
        "Total throughput rises fast at first, then flattens.",
        "Each user's speed falls as the batch grows. There is no free lunch, only a choice."
      ],
      explain: [
        "Because decode is memory bound, the GPU spends most of each step reading the weights. Reading them once and producing a token for 32 requests costs barely more than producing one token for one request. That is batching.",
        "Bigger batches mean many more tokens per GPU per second, so a much lower cost per token. But each step gets a little slower as more KV cache has to be read, so each user sees fewer tokens per second.",
        "Modern engines use continuous batching: requests join and leave the batch at every step instead of waiting for a whole batch to finish. It is one of the biggest efficiency gains in serving.",
        "Product tiers are partly batch size decisions. A latency sensitive tier runs smaller batches and costs more. A batch tier runs large batches on spare capacity and costs less."
      ],
      check: [
        { q: "Why does batching help so much for decode but not much for prefill?", a: "Decode is limited by reading the weights, which a batch shares. Prefill is already compute bound and parallel, so it gains less." },
        { q: "What does continuous batching change?", a: "Requests are added and removed at every generation step, so short requests do not wait for long ones and the GPU stays full." }
      ],
      sources: [
        { t: "Anyscale, continuous batching for LLM inference", u: "https://www.anyscale.com/blog/continuous-batching-llm-inference", n: "Clear explanation with throughput numbers." },
        { t: "NVIDIA, inference optimisation", u: "https://developer.nvidia.com/blog/mastering-llm-techniques-inference-optimization/", n: "Batching, KV cache and memory bandwidth." }
      ]
    },
    {
      id: "speed",
      title: "Tricks that make inference faster",
      short: "Speculative decoding, quantisation, caching, MoE",
      minutes: 20,
      labs: ["speculative"],
      doThis: [
        "Watch a few rounds. Green tokens were accepted, red is the first miss, blue is the big model's own token.",
        "Drop acceptance to 40%. Then raise it to 90%. Watch the speed up.",
        "Raise the draft cost to 30% and see how much of the gain disappears."
      ],
      notice: [
        "Speculative decoding only pays when the draft model is usually right and cheap to run.",
        "Every pass of the big model always produces at least one token, so the worst case is no slower than normal decoding, apart from the draft cost."
      ],
      explain: [
        "Speculative decoding: a small, fast model guesses the next few tokens. The big model checks all of them in one pass, which costs about the same as producing one token. It keeps the guesses up to the first wrong one and adds its own. The output is the same as the big model alone, just produced faster.",
        "Quantisation stores weights or the KV cache in fewer bits, such as FP8 or INT4. Less memory to read means faster decode and more room for users. The risk is a small drop in quality, so it has to be evaluated for each use case.",
        "Prompt caching reuses the KV cache for repeated prompt beginnings, such as a long system prompt shared by many requests. That work is done once. It is what sits behind Mistral's cached input price, up to 90% cheaper than fresh input.",
        "Mixture of experts models only use some of their parameters for each token. Compute per token follows the active parameters, but memory must still hold all of them, which shapes how many GPUs you need."
      ],
      check: [
        { q: "Acceptance is 80% and you draft 4 tokens. Roughly how many tokens per big model pass?", a: "(1 − 0.8⁵) ÷ (1 − 0.8) ≈ 3.4 tokens, compared with 1 without speculation." },
        { q: "A customer sends the same 6,000 token system prompt with every request. What do you offer?", a: "Prompt caching. The repeated prefix is processed once and billed at the cached input price." },
        { q: "What must you check before shipping a quantised model?", a: "Quality on the customer's real tasks, not just benchmarks. Small accuracy losses can matter in extraction or reasoning." }
      ],
      sources: [
        { t: "Speculative decoding paper", u: "https://arxiv.org/abs/2211.17192", n: "The expected tokens per pass and speed up formulas used in the lab." },
        { t: "DeepLearning.AI, Quantization Fundamentals", u: "https://www.deeplearning.ai/short-courses/quantization-fundamentals-with-hugging-face/", n: "Hands on quantisation." },
        { t: "Mistral API pricing", u: "https://docs.mistral.ai/inference/pricing", n: "Cached input prices beside standard input." }
      ]
    },
    {
      id: "platform",
      title: "The product surface",
      short: "Gateway, tiers, regions, dedicated endpoints",
      minutes: 20,
      labs: ["request-flow"],
      doThis: [
        "Send free tier traffic. Watch some requests get stopped at the gateway.",
        "Switch to Priority, then Batch, then EU regional, then Dedicated. Each takes a different path or speed.",
        "Click every box. Each one tells you what the product manager decides there."
      ],
      notice: [
        "Most of an inference product is not the model. It is the gateway, the queues, the pools and the meter.",
        "Each tier is a promise about one of those boxes."
      ],
      explain: [
        "A managed inference platform has a handful of parts. The gateway authenticates, applies rate limits and quotas, and stops abuse. The router picks a queue and a replica. GPU pools serve the work: shared serverless capacity, regional pools, batch capacity and dedicated endpoints. Metering counts tokens and turns them into revenue.",
        "Mistral's published product surface maps onto that picture. Standard and Priority share capacity, with Priority queued first under load. Batch is queued and processed within 24 hours. Regional endpoints run inference in the EU or US. Third-party open models now run on the same infrastructure and service commitments.",
        "The spec's free tier fraud example lives at the gateway. The levers are verification, credit caps, rate limits and anomaly detection. Each one adds some friction for genuine developers, so the job is to stop abuse without slowing down the people you want.",
        "Dedicated endpoints sit beside all this. They reserve capacity for one customer, so they suit steady workloads and customers who want isolation and predictable latency."
      ],
      check: [
        { q: "How would you cut free tier abuse without hurting genuine developers?", a: "Layer the controls: light verification at sign up, credit and rate caps, anomaly detection on usage patterns, and a fast path to raise limits for verified users. Measure false positives as carefully as abuse." },
        { q: "Why does regional inference cost more?", a: "It constrains where work can run, so capacity is less pooled and utilisation is harder to keep high." },
        { q: "When would you steer a customer to a dedicated endpoint?", a: "Steady, high volume traffic, strict latency needs, isolation requirements, or custom models that need their own capacity." }
      ],
      sources: [
        { t: "Mistral, in-region inference and new European infrastructure", u: "https://mistral.ai/news/regional-inference-open-models-new-compute/", n: "Regional endpoints, Priority Tier, third-party open models, European Compute Units." },
        { t: "Mistral Priority Tier", u: "https://docs.mistral.ai/inference/priority-tier", n: "Batch, Standard and Priority compared." },
        { t: "Mistral regional inference", u: "https://docs.mistral.ai/inference/regional-inference", n: "Endpoints, upcharge and limitations." }
      ]
    },
    {
      id: "customise",
      title: "Customising models",
      short: "Prompting, retrieval, LoRA and distillation",
      minutes: 15,
      labs: ["finetune"],
      doThis: [
        "Answer the three questions for a bank extracting fields from noisy scanned documents.",
        "Then answer them for an internal assistant over SharePoint and email.",
        "Watch the adapters cycle on one base model at the bottom."
      ],
      notice: [
        "Fine tuning is rarely the first answer. Retrieval solves knowledge problems without retraining.",
        "LoRA turns customisation into an inference problem: many small adapters, one shared base model."
      ],
      explain: [
        "Work up a ladder. Start with better prompts. Add retrieval when the model needs facts that change or a customer's own documents. Fine tune when the gap is behaviour, format, tone or domain language that prompting cannot fix. Distil to a smaller model when the problem is cost or latency at high volume.",
        "LoRA trains small adapter matrices while the base model stays frozen. Training is cheap, and many adapters can be served on one base model, swapped in per request. That makes custom models economical to host.",
        "Mistral sells this through Forge, which builds models grounded in an enterprise's own knowledge. Serving those custom models, on shared or dedicated capacity, is part of the inference portfolio.",
        "Whatever the method, plan the evaluation first. Without a fixed test set and scoring rules you cannot tell whether a change helped."
      ],
      check: [
        { q: "A customer wants the model to know this week's prices. Fine tune?", a: "No. Prices change, so use retrieval. Fine tuning bakes in knowledge that goes stale." },
        { q: "How do you host hundreds of customer fine tunes economically?", a: "LoRA adapters on a shared base model, loaded per request, with dedicated capacity only for the biggest customers." }
      ],
      sources: [
        { t: "LoRA paper", u: "https://arxiv.org/abs/2106.09685", n: "How low rank adapters work." },
        { t: "Mistral fine tuning documentation", u: "https://docs.mistral.ai/capabilities/finetuning/", n: "How Mistral packages customisation." },
        { t: "Mistral, Introducing Forge", u: "https://mistral.ai/news/forge/", n: "Enterprise models grounded in proprietary knowledge." },
        { t: "DeepLearning.AI, Finetuning Large Language Models", u: "https://www.deeplearning.ai/short-courses/finetuning-large-language-models/", n: "When and how to fine tune." }
      ]
    },
    {
      id: "proving",
      title: "Proving it with a customer",
      short: "Fair bake-offs, latency budgets and guardrails",
      minutes: 30,
      labs: ["eval-strata", "latency-budget", "guardrail"],
      doThis: [
        "Strata lab: push the improvement to +15 points. Watch the weakest type jump and the overall average barely move. Then switch to weighting each type equally.",
        "Voice lab: switch speech to start after the whole answer. Watch the caller's wait blow through the target. Switch back, then find the slider that matters most.",
        "Guardrail lab: press the 'allows everything' button with 5% unsafe prompts. Look at the accuracy. Then move the threshold and watch caught versus blocked by mistake trade against each other."
      ],
      notice: [
        "An overall average can hide a big win, or a big failure, in the segment the customer actually cares about.",
        "In voice, the first sentence decides the experience. Time to first token and streaming matter more than raw output speed.",
        "A guardrail can score 95% accuracy while catching nothing, if unsafe prompts are rare. Accuracy alone is the wrong measure."
      ],
      explain: [
        "Enterprise inference deals are won in a bake-off against what the customer runs today, usually an open model on their own hardware or a hosted service. A fair comparison freezes the test set, uses the same scoring rules and the same conditions for both, repeats the runs, and is agreed in writing before anything is tested. If you skip that, every result can be argued away.",
        "Report results by segment. Document extraction is a good example: clean PDFs are already near perfect, while noisy scans and handwriting are where accuracy is weak and where the business value sits. Set targets on the weak segments, such as a percentage point gain on types currently under a threshold, not on the overall average.",
        "For retrieval, score retrieval and generation separately, or you cannot tell whether a bad answer came from the wrong documents or a poor use of the right ones. For agents that act on email and documents, test with several user personas, record every tool call, and check that nobody sees content they are not permitted to see.",
        "Voice agents run on a latency budget, roughly a second from the caller stopping to the first audio. Every stage takes a slice: turn detection, speech to text, retrieval, the model's first sentence and the first audio. Streaming speech from the first sentence, short prompts and fast time to first token matter far more than tokens per second.",
        "Guardrails need two numbers, not one: how much unsafe content is caught (recall, or its opposite, the false negative rate) and how many genuine users are wrongly blocked (the false positive rate), ideally per category and per language, judged by native speakers. They also add latency to every request, so measure p50, p95 and p99 with and without them."
      ],
      check: [
        { q: "Overall extraction accuracy improved by only two points. Is the PoC a failure?", a: "Not necessarily. Look by document type. If the weak types improved by ten points or more, that is where the value is, and the average is diluted by types that were already near perfect." },
        { q: "A guardrail reports 95% accuracy and 5% of prompts are unsafe. What do you ask?", a: "What is the recall, or false negative rate? A guardrail that blocks nothing also scores 95%. Then ask for the false positive rate and results by category and language." },
        { q: "The voice agent is 400 ms over budget. Where do you look first?", a: "Make sure speech starts streaming from the first sentence, then cut time to first token: shorter prompts, less retrieved context, warm models and capacity close to the caller. Retrieval and turn detection are the next biggest slices." },
        { q: "Why score retrieval separately from the final answer?", a: "Otherwise you cannot tell whether failures come from fetching the wrong documents or from the model misusing the right ones, and the fixes are completely different." }
      ],
      sources: [
        { t: "Google, accuracy, precision and recall", u: "https://developers.google.com/machine-learning/crash-course/classification/accuracy-precision-recall", n: "Why accuracy misleads on imbalanced data." },
        { t: "Mistral, Shieldstral", u: "https://mistral.ai/news/shieldstral/", n: "Open-weights safety classifier that returns a calibrated score you set a threshold on." },
        { t: "Mistral guardrailing documentation", u: "https://docs.mistral.ai/capabilities/guardrailing/", n: "Moderation options on Mistral's platform." },
        { t: "Mistral OCR 4", u: "https://mistral.ai/news/ocr-4/", n: "Document understanding model and its benchmarks." },
        { t: "Mistral Voxtral 3", u: "https://mistral.ai/news/voxtral-3/", n: "Speech models for voice agents." },
        { t: "Ragas documentation", u: "https://docs.ragas.io/", n: "Open-source metrics for evaluating retrieval and generation separately." }
      ]
    }
  ]
};
