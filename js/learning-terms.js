/* Deeper content for each lesson: plain-English terms with infrastructure analogies, and worked examples.
   Worked examples use the same default numbers as the labs, so you can check them by moving the sliders. */
window.LEARNING_EXTRAS = {
  economics: {
    terms: [
      { t: "Token", what: "The unit models read and write. A piece of a word: in English roughly three quarters of a word, or about four characters. Other languages often need more tokens for the same text.", why: "Everything in inference is counted, priced and capacity-planned in tokens. Price per million tokens is the headline number on every pricing page.", like: "Like a packet in networking. Users think in messages, the system is built and billed around the unit underneath." },
      { t: "Input tokens and output tokens", what: "Input tokens are what you send: instructions, history, documents and the question. Output tokens are what the model writes back.", why: "They cost very different amounts to produce, so they are priced separately. Mistral Large 4 is $0.70 per million input and $2.10 per million output.", like: "Like a backup job where reading is cheap and writing is expensive. The mix of the two drives the bill." },
      { t: "Tokens per second per GPU (throughput)", what: "How many tokens one GPU delivers each second across every request it is serving at once.", why: "Combined with the GPU's hourly cost it sets the floor on cost per token. It varies hugely with model size, batch size and hardware, so it has to be measured, not assumed.", like: "Like IOPS for a storage array. A headline figure is meaningless until you know the workload behind it." },
      { t: "Utilisation", what: "The share of paid GPU time spent on work customers pay for.", why: "The most powerful lever on unit cost. At 30% utilisation every token costs twice what it does at 60%.", like: "Exactly like consolidation ratios in a private cloud. Idle hosts still cost money." },
      { t: "Cost to serve", what: "What it costs the provider to produce a million tokens: GPU rental or depreciation, power and hosting, networking, the people who run it, and any idle or free capacity.", why: "The other half of gross margin. The lab only models the GPU part, which is usually the biggest.", like: "Like fully loaded cost per VM rather than just the hardware price." },
      { t: "Blended price", what: "The average price per million tokens once the input and output mix is taken into account.", why: "Chat with retrieval is input heavy, often three or more input tokens per output token, which pulls the blended price towards the cheaper input rate.", like: "Like a blended rate for a services team with different day rates per role." },
      { t: "Gross margin", what: "Revenue minus cost to serve, divided by revenue.", why: "The spec asks the Lead PM to own it. Tiers, pricing and utilisation all exist to protect it.", like: "The same calculation you would run on a managed service offer." },
      { t: "Batch, Standard and Priority tiers", what: "Mistral's service levels. Batch is processed within 24 hours. Standard is best effort. Priority queues ahead under load at 1.75× the list price, with a 99.5% uptime SLA.", why: "Each tier sells a different promise about when work runs. That lets the provider fill capacity at different prices.", like: "Like storage tiers or QoS classes: the same hardware, different guarantees, different prices." },
      { t: "Capacity relative to peak", what: "In the second lab, how much GPU capacity you commit to, as a share of the busiest moment of the day.", why: "Below 100% you turn away demand at the peaks. Above it you pay for idle GPUs in the troughs.", like: "Sizing a cluster for peak or for average, the classic capacity planning trade-off." }
    ],
    worked: { title: "Check the lab's default numbers", steps: [
      "Tokens served in an hour: 3,000 tokens a second × 3,600 seconds × 60% utilisation = 6,480,000 tokens.",
      "Cost per million tokens: $3 ÷ 6.48 million ≈ $0.463.",
      "Blended price with three input tokens per output token: (3 × $0.70 + 1 × $2.10) ÷ 4 = $1.05 per million.",
      "Gross margin: ($1.05 − $0.463) ÷ $1.05 ≈ 56%.",
      "Break-even utilisation: the point where cost equals price. $3 ÷ (3,000 × 3,600 × $1.05 ÷ 1,000,000) ≈ 26%. Below that, every token loses money."
    ] }
  },
  request: {
    terms: [
      { t: "Tokeniser", what: "The step that turns text into tokens before the model sees it, and turns tokens back into text afterwards.", why: "It decides how many tokens, and so how much cost and time, a piece of text becomes. Some languages tokenise less efficiently than English.", like: "Like encoding or compression on a link: the same content can be a different size on the wire." },
      { t: "Prompt", what: "Everything sent to the model in one request: system instructions, conversation history, retrieved documents and the user's question.", why: "Prompt length drives prefill time and therefore time to first token. Long retrieved context is the usual culprit.", like: "Like the payload of a request. The size of the payload, not the question, dominates the transfer time." },
      { t: "Prefill", what: "The first phase of a request. The GPU processes all the prompt tokens in parallel and builds the KV cache.", why: "It is limited by raw compute and sets time to first token. Long prompts mean a long wait before anything appears.", like: "Like loading a working set into cache before a job starts." },
      { t: "Decode", what: "The second phase. The model writes the answer one token at a time, because each token depends on the one before.", why: "Each step reads all the weights and the KV cache from memory, so speed is limited by memory bandwidth. This sets how fast the answer streams.", like: "Like a chatty protocol that needs a round trip per message. Bandwidth per round trip matters more than raw compute." },
      { t: "Time to first token (TTFT)", what: "Time from sending the request until the first token of the answer arrives.", why: "What users feel as 'is it working?'. Driven by queueing and prefill.", like: "Like time to first byte on a web request." },
      { t: "Output speed (tokens per second per user)", what: "How quickly the rest of the answer streams once it starts. Also called time per output token or inter-token latency.", why: "What users feel as reading speed. Driven by decode and by how many other requests share the GPU.", like: "Like sustained throughput after the connection is established." },
      { t: "Compute bound and memory bandwidth bound", what: "Whether a task is limited by how fast the GPU can do maths or by how fast it can move data from memory.", why: "Prefill is compute bound. Decode is memory bandwidth bound. Different bottlenecks need different fixes and different hardware.", like: "Like CPU-bound versus IO-bound workloads." },
      { t: "Queueing", what: "Time a request waits before the GPU starts on it, because other work is ahead of it.", why: "Under load it can dominate time to first token. Priority tiers exist to cut it.", like: "Like a storage queue depth building up under load." }
    ],
    worked: { title: "Check the lab's default numbers", steps: [
      "Prompt of 2,000 tokens processed at 8,000 tokens a second: 2,000 ÷ 8,000 = 0.25 seconds of prefill.",
      "Add 0.15 seconds of queueing: time to first token = 0.40 seconds.",
      "Answer of 300 tokens at 60 tokens a second: 300 ÷ 60 = 5 seconds of decode.",
      "Full answer: 0.40 + 5 = 5.4 seconds. Notice the answer length, not the prompt, dominates the total.",
      "Raise the prompt to 128,000 tokens: 128,000 ÷ 8,000 = 16 seconds before the first token. That is why long-context products are judged on time to first token."
    ] }
  },
  memory: {
    terms: [
      { t: "GPU memory (HBM)", what: "High bandwidth memory soldered next to the GPU. Approximate sizes: H100 80 GB, H200 141 GB, B300 288 GB.", why: "Everything needed to serve the model, weights and every user's KV cache, has to fit here. When it is full, requests wait.", like: "Like RAM in a host, but very fast and impossible to add later. Fixed per card, so you scale by adding cards." },
      { t: "Model size (parameters)", what: "The number of learned numbers in the model. ~7B means about 7 billion.", why: "Sets how much memory the weights need and how much data each decode step must read.", like: "Like the size of a VM image that has to be in memory before anything runs." },
      { t: "Dense model", what: "A model that uses all of its parameters for every token. The lab assumes dense models.", why: "Memory and compute both scale with the full parameter count. Mixture of experts models behave differently (see lesson 5).", like: "Like a monolith, as opposed to services where only some parts handle each request." },
      { t: "Weight precision", what: "How many bytes are used to store each parameter. FP16 (16-bit floating point) is 2 bytes. FP8 is 1 byte. INT4 (4-bit integer) is half a byte.", why: "Halving the bytes halves the weights' memory and the data read on every decode step, so more room for users and faster output. The cost is a possible small drop in quality, which has to be tested. FP8 is supported natively on H100 and newer. INT4 is usually applied to weights only.", like: "Like choosing compression or deduplication on a storage volume: more fits and it moves faster, but you check it does not damage what matters." },
      { t: "KV cache", what: "For every token already processed, the model stores a key and a value at every layer, so it does not recompute them for each new token.", why: "It grows with every token of context and every request in flight. In serving it is usually what runs out first, not the weights.", like: "Like per-session state held in memory. Each connection costs memory for as long as it is open, and longer sessions cost more." },
      { t: "KV cache precision", what: "How many bytes store each number in the KV cache. FP16 is 2 bytes, FP8 is 1 byte.", why: "FP8 KV cache halves the memory each request needs, so roughly twice as many requests or twice the context fit. Serving engines such as vLLM support it. Quality impact is usually small but should be checked.", like: "Like compressing session state so a load balancer can hold twice as many sessions." },
      { t: "KV heads and head size (\"8 KV heads of 128\")", what: "Attention is split into heads. Modern models use fewer heads for keys and values than for queries, called grouped-query attention. Mistral 7B has 32 query heads but only 8 KV heads, each 128 numbers wide.", why: "Fewer KV heads means a much smaller KV cache. It is a design choice that makes serving cheaper. The lab uses 8 KV heads of 128 for all three model sizes to keep the comparison simple.", like: "Like sharing one index across several readers instead of keeping a copy per reader." },
      { t: "Layers", what: "The model is a stack of identical blocks. Each layer keeps its own KV cache.", why: "KV cache per token is multiplied by the number of layers. Bigger models usually have more layers.", like: "Like each tier in a multi-tier app keeping its own session state." },
      { t: "Context per request", what: "How many tokens a single conversation holds at once: prompt plus answer so far. Model limits are often 128k tokens or more.", why: "KV cache grows linearly with it. Long context is a feature with a real capacity cost.", like: "Like the size of each user's working set." },
      { t: "Concurrency (requests running at once)", what: "How many requests the GPU is serving at the same moment, each with its own KV cache.", why: "More concurrency means more throughput and lower cost per token, until memory runs out.", like: "Like concurrent sessions on a server." },
      { t: "Runtime overhead", what: "Memory the serving engine needs for working space, activations and buffers. The lab assumes about 10%.", why: "It is real and easy to forget when sizing. vLLM, for example, uses about 90% of GPU memory by default.", like: "Like hypervisor and OS overhead on a host." },
      { t: "Number of GPUs (tensor parallelism)", what: "Splitting the model across several GPUs in one server, connected by very fast links, so each holds part of every layer.", why: "Lets models too big for one GPU run at all, and adds memory for KV cache. It costs some communication between GPUs.", like: "Like striping a volume across several disks to get capacity and throughput." }
    ],
    worked: { title: "Check the lab's default numbers", steps: [
      "Weights: 7.3 billion parameters × 2 bytes (FP16) ≈ 14.6 GB.",
      "Overhead: 10% of 80 GB = 8 GB. Free for KV cache: 80 − 14.6 − 8 = 57.4 GB.",
      "KV cache per token: 2 (key and value) × 32 layers × 8 KV heads × 128 numbers × 2 bytes = 131,072 bytes = 128 KB.",
      "Per request at 32,768 tokens of context: 128 KB × 32,768 ≈ 4.3 GB.",
      "Requests that fit: 57.4 ÷ 4.3 ≈ 13. Switch the KV cache to FP8 and each request needs about 2.1 GB, so about 26 fit."
    ] }
  },
  batching: {
    terms: [
      { t: "Batch", what: "The set of requests the GPU works on together in one decode step. Each request gets one new token per step.", why: "The weights are read once per step whatever the batch size, so bigger batches share that cost across more tokens.", like: "Like a bus instead of a taxi. One journey, many passengers." },
      { t: "Decode step", what: "One pass through the model that produces one token for every request in the batch.", why: "Its length sets every user's output speed. It gets a little longer as the batch grows, because each request adds its own KV cache to read.", like: "Like a clock cycle shared by everyone on the bus." },
      { t: "Throughput (total tokens per second)", what: "Tokens produced per second across all requests on the GPU.", why: "What sets cost per token. It rises quickly with batch size, then flattens.", like: "Aggregate throughput across all clients of a storage array." },
      { t: "Per-user speed", what: "Tokens per second that one user sees.", why: "Falls as the batch grows. The product decides how far it may fall for each tier.", like: "Per-client latency, which rises as the array gets busier." },
      { t: "Continuous batching", what: "Adding and removing requests at every step instead of waiting for a whole batch to finish. Also called in-flight or iteration-level batching.", why: "Short answers do not wait for long ones and the GPU stays full. One of the biggest efficiency gains in modern serving.", like: "Like a lift that lets people on and off at every floor rather than making everyone ride to the top." },
      { t: "Scheduler", what: "The part of the serving engine that decides which requests join each step, respecting memory limits and priorities.", why: "Where tiers, fairness and priority are actually enforced.", like: "Like a hypervisor's CPU scheduler deciding which VMs run next." }
    ],
    worked: { title: "Check the lab's default numbers", steps: [
      "Teaching model: a step takes 10 ms to read the weights, stretched by (1 + batch ÷ 48) as each request adds KV cache reads.",
      "Batch of 16: 10 × (1 + 16 ÷ 48) ≈ 13.3 ms per step.",
      "Each user gets one token per step: 1,000 ÷ 13.3 ≈ 75 tokens a second.",
      "Total throughput: 16 × 75 = 1,200 tokens a second.",
      "Cost per million output tokens at $3 an hour: $3 ÷ (1,200 × 3,600) × 1,000,000 ≈ $0.69.",
      "At batch 1 the same GPU makes about 98 tokens a second, so a million tokens costs about $8.50. Batching makes tokens over ten times cheaper."
    ] }
  },
  speed: {
    terms: [
      { t: "Draft model", what: "A small, fast model that guesses the next few tokens.", why: "Its guesses are cheap. If they are usually right, the big model can accept several tokens per pass.", like: "Like speculative execution in a CPU: do work early and keep it if the guess was right." },
      { t: "Target model", what: "The big model whose output you actually want. It checks the draft's guesses.", why: "Checking several tokens in one pass costs about the same as producing one, because decode is memory bound.", like: "The authoritative system that validates a cached answer." },
      { t: "Acceptance rate", what: "How often the target model agrees with a draft token.", why: "Drives the whole gain. High on predictable text such as code or boilerplate, lower on creative or unusual text.", like: "Like a cache hit rate." },
      { t: "Draft tokens per round", what: "How many tokens the draft proposes before each check.", why: "More tokens can pay off when acceptance is high, but each wasted guess still costs draft time.", like: "Like prefetch depth: deeper prefetch helps only when the pattern is predictable." },
      { t: "Quantisation", what: "Storing weights, and sometimes the KV cache, in fewer bits: FP8, INT8, INT4 or FP4.", why: "Less memory and less data to read per step, so faster and cheaper, with a quality risk that must be tested on the customer's tasks.", like: "Like lossy compression: fine for most content, check it on what matters." },
      { t: "Prefix caching", what: "Keeping the KV cache for a prompt start that many requests share, such as a long system prompt, and reusing it.", why: "Skips repeated prefill, cutting time to first token and cost. Behind Mistral's cached input price, up to 90% lower.", like: "Like a shared read cache for a common golden image." },
      { t: "Mixture of experts (MoE)", what: "A model split into many expert sub-networks, of which only a few run for each token.", why: "Compute per token follows the active parameters, but memory must hold all of them. Cheap to run per token, expensive to host.", like: "Like a large pool of specialist services where each request only calls a few." }
    ],
    worked: { title: "Check the lab's default numbers", steps: [
      "Expected tokens per target pass with acceptance a and k draft tokens: (1 − a^(k+1)) ÷ (1 − a).",
      "With a = 75% and k = 4: (1 − 0.75^5) ÷ 0.25 = (1 − 0.237) ÷ 0.25 ≈ 3.05 tokens per pass, against 1 without speculation.",
      "The draft costs 5% of a target pass per token, so 4 drafts add 20%: speed-up ≈ 3.05 ÷ 1.2 ≈ 2.5×.",
      "Drop acceptance to 40%: (1 − 0.4^5) ÷ 0.6 ≈ 1.65 tokens per pass, ÷ 1.2 ≈ 1.4×. Most of the gain disappears.",
      "Prefix caching example on Mistral Large 4: 6,000 cached tokens at $0.07 per million instead of $0.70 saves about $0.0038 per request. Across ten million requests that is about $38,000."
    ] }
  },
  platform: {
    terms: [
      { t: "API gateway", what: "The front door: checks API keys, applies limits and quotas, and blocks abuse.", why: "Where free tier fraud is fought, and where the friction for genuine developers is decided.", like: "Like a firewall and load balancer in front of an app." },
      { t: "Rate limits (RPM and TPM)", what: "Caps on requests per minute and tokens per minute for each customer or key.", why: "Protect shared capacity and shape fair use. Priority Tier comes with custom limits per model.", like: "Like QoS policing on a network port." },
      { t: "Router and queues", what: "Decides which queue and which model replica serves a request.", why: "Where priority, region and fallback rules are applied, and where prefix cache hits are won by sending similar requests to the same replica.", like: "Like a load balancer with session affinity." },
      { t: "Replica", what: "One running copy of a model, on one or more GPUs.", why: "Capacity is added by adding replicas. Each takes time to start because weights must load.", like: "Like an instance in a scale set." },
      { t: "Autoscaling and cold start", what: "Adding or removing replicas as demand changes. A cold start is the delay while a new replica loads its weights.", why: "Loading tens of gigabytes of weights takes time, so scaling too late hurts latency and scaling too early wastes money.", like: "Like VM scale-out with a slow boot image." },
      { t: "Regional endpoint", what: "An API address that keeps inference processing in a chosen geography, the EU or US for Mistral, at a 10% premium.", why: "Meets data location and latency needs. Mistral notes the control plane, such as accounts and billing, is not made regional.", like: "Like region pinning for a cloud service, with the management plane still global." },
      { t: "Control plane and data plane", what: "The control plane manages accounts, keys, billing and configuration. The data plane carries the actual prompts and answers.", why: "Sovereignty questions often turn on which plane sits where. Regulated customers ask about both.", like: "Exactly the distinction you use for Arc and hybrid management." },
      { t: "Dedicated endpoint", what: "Capacity reserved for one customer.", why: "Predictable latency and isolation, priced on capacity rather than tokens, so the customer carries the utilisation risk.", like: "Like dedicated hosts rather than shared tenancy." },
      { t: "Metering", what: "Counting input, cached input and output tokens per request and applying prices and multipliers.", why: "Where pricing becomes revenue. Mistral also reports which tier actually served each request.", like: "Like consumption metering for an Azure service." },
      { t: "SLA", what: "A contractual service level, such as Priority Tier's 99.5% uptime.", why: "Turns reliability into something a customer can buy and a provider must engineer and staff for.", like: "The same commitments you discuss for any managed service." }
    ],
    worked: { title: "Price one request on Mistral Large 4", steps: [
      "A request with 6,000 cached system prompt tokens, 1,000 new input tokens and 500 output tokens.",
      "Cached input: 6,000 × $0.07 per million = $0.00042. New input: 1,000 × $0.70 per million = $0.00070. Output: 500 × $2.10 per million = $0.00105.",
      "Total at Standard: about $0.0022. Without caching the 6,000 tokens would cost $0.0042 on their own, so caching cuts the request by about 64%.",
      "On Priority Tier the same request is 1.75× after caching, about $0.0038.",
      "On a regional endpoint it is 1.1×, about $0.0024. Check the documentation for how multipliers combine before quoting a customer."
    ] }
  },
  customise: {
    terms: [
      { t: "Retrieval augmented generation (RAG)", what: "Finding relevant passages from a customer's documents at question time and putting them into the prompt.", why: "Gives the model current, private knowledge without retraining. Usually the first answer to 'it doesn't know our stuff'.", like: "Like giving a consultant the right folder before the meeting rather than retraining them." },
      { t: "Embedding", what: "A list of numbers that represents the meaning of a piece of text. Similar meanings give nearby vectors.", why: "How retrieval finds relevant chunks without matching exact words.", like: "Like a fingerprint or hash, but one where similar content gets similar fingerprints." },
      { t: "Vector database", what: "A database built to find the stored embeddings closest to a query embedding.", why: "The core of retrieval. Choice, scale and latency all matter in production.", like: "Like a search index, organised by meaning rather than keywords." },
      { t: "Chunking", what: "Splitting documents into passages before embedding them.", why: "Chunk size and overlap strongly affect retrieval quality.", like: "Like choosing a block size for a file system." },
      { t: "Fine-tuning", what: "Continuing to train a model on examples so it changes behaviour, format, tone or domain language.", why: "Fixes gaps prompting cannot, but it bakes in knowledge that can go stale, so it is not for facts that change.", like: "Like changing a golden image rather than adding configuration at deploy time." },
      { t: "LoRA (low-rank adaptation)", what: "Fine-tuning that trains two small matrices per layer instead of changing the original weights. The adapter is tiny compared with the model.", why: "Cheap to train and store, and many adapters can be served on one shared base model. That makes custom models an economical inference product.", like: "Like a small configuration overlay on a shared base image." },
      { t: "Distillation", what: "Training a smaller model on a larger model's outputs.", why: "Cuts cost per token and latency at high volume, keeping much of the quality on a specific task.", like: "Like replacing a general-purpose appliance with a purpose-built one for a single job." },
      { t: "Evaluation set", what: "A fixed set of examples with agreed correct answers, used to judge any change.", why: "Without one you cannot tell whether a change helped. Agree it before tuning anything.", like: "Like a regression test suite." }
    ],
    worked: { title: "Why LoRA adapters are so small", steps: [
      "A single weight matrix in a mid-sized model might be 4,096 × 4,096 ≈ 16.8 million numbers.",
      "A rank-16 LoRA replaces changes to it with two thin matrices: 4,096 × 16 + 16 × 4,096 ≈ 131,000 numbers.",
      "That is under 1% of the original matrix. Across the model, an adapter is typically tens of megabytes against tens of gigabytes for the base.",
      "So one base model in GPU memory can serve many customers' adapters, swapped per request, instead of hosting a full copy of the model for each customer."
    ] }
  },
  proving: {
    terms: [
      { t: "Baseline", what: "The customer's current system, measured on the same test set.", why: "Results only mean something relative to what they have today.", like: "Like a performance baseline before a migration." },
      { t: "Ground truth", what: "The agreed correct answer for each test example, usually checked by people.", why: "Everything is scored against it. If it is wrong or disputed, the evaluation fails.", like: "Like a known-good restore you verify a backup against." },
      { t: "Stratified results (by segment)", what: "Reporting results separately by document type, language, question type or user group.", why: "Averages hide where value and risk are. Weak segments are usually where the business case lives.", like: "Like looking at p99 latency per tenant instead of the global average." },
      { t: "Precision", what: "Of everything the system flagged, the share that was really positive. For a guardrail: of the prompts blocked, how many were actually unsafe.", why: "Low precision means genuine users are being blocked.", like: "Like the share of security alerts that were real incidents." },
      { t: "Recall", what: "Of everything that was really positive, the share the system caught. For a guardrail: of the unsafe prompts, how many were blocked.", why: "Low recall means harmful content gets through. Often the number regulators care about most.", like: "Like the share of real incidents your monitoring detected." },
      { t: "False positive and false negative rates", what: "False positives are genuine requests wrongly blocked. False negatives are harmful requests wrongly allowed.", why: "The threshold trades one against the other. The customer has to choose the balance per category.", like: "Like tuning an intrusion detection system." },
      { t: "Prevalence", what: "How common the positive case is, for example how many prompts are actually unsafe.", why: "When it is rare, accuracy becomes misleading. A system that does nothing can score very high.", like: "Like a disk failure predictor that says 'never' and is right 99.9% of the time." },
      { t: "Threshold", what: "The score above which the classifier acts, for example blocks.", why: "Moving it shifts errors between false positives and false negatives without changing the model.", like: "Like an alerting threshold on a metric." },
      { t: "p50, p95 and p99 latency", what: "The time within which 50%, 95% and 99% of requests complete.", why: "Averages hide the slow requests users remember. SLAs and voice budgets are written in percentiles.", like: "The same percentiles you use for storage and network latency." },
      { t: "Voice pipeline: turn detection, speech to text, text to speech", what: "Turn detection notices the caller has stopped speaking. Speech to text turns audio into words. Text to speech turns the answer back into audio.", why: "Each takes a slice of a budget of roughly one second to first audio.", like: "Like each hop on a network path adding latency to a round trip." },
      { t: "Streaming", what: "Sending the answer as it is generated instead of waiting for it to finish.", why: "For voice, speech can start after the first sentence, which saves seconds.", like: "Like progressive download versus downloading the whole file first." }
    ],
    worked: { title: "Check the guardrail lab's default numbers", steps: [
      "10,000 prompts, 5% unsafe: 500 unsafe and 9,500 safe.",
      "At a threshold of 0.50 the classifier blocks 432 of the 500 unsafe prompts. Recall = 432 ÷ 500 ≈ 86%.",
      "It also blocks 1,289 safe prompts. False positive rate = 1,289 ÷ 9,500 ≈ 13.6%. Precision = 432 ÷ (432 + 1,289) ≈ 25%.",
      "Accuracy = (432 + 8,211) ÷ 10,000 ≈ 86.4%.",
      "A guardrail that allows everything: 9,500 ÷ 10,000 = 95% accuracy, 0% recall. That is why an accuracy target alone is not enough."
    ] }
  }
};
