/* Animated diagram scripts for each lesson. Numbers match the default settings in the labs. */
window.LEARNING_DIAGRAMS = {
  economics: {
    title: "From a GPU hour to gross margin", w: 940, h: 340,
    nodes: [
      { id: "gpu", x: 110, y: 90, label: "GPU hour", sub: "$3, busy or idle", icon: "gpu", tone: "blue", at: 0 },
      { id: "work", x: 350, y: 90, label: "Billable work", sub: "60% of the hour", icon: "bolt", tone: "green", at: 1 },
      { id: "idle", x: 350, y: 250, label: "Idle time", sub: "40%, still paid for", icon: "clock", tone: "grey", at: 1 },
      { id: "tokens", x: 590, y: 90, label: "Tokens served", sub: "6.5 M per hour", icon: "layers", tone: "green", at: 2 },
      { id: "cost", x: 830, y: 90, label: "Cost to serve", sub: "$0.46 per M tokens", icon: "money", tone: "red", at: 3 },
      { id: "price", x: 590, y: 250, label: "Price", sub: "$1.05 per M, blended", icon: "meter", tone: "orange", at: 4 },
      { id: "margin", x: 830, y: 250, label: "Gross margin", sub: "56%", icon: "check", tone: "green", at: 5 }
    ],
    edges: [
      { id: "e1", from: "gpu", to: "work", at: 1 }, { id: "e2", from: "gpu", to: "idle", at: 1, tone: "grey" },
      { id: "e3", from: "work", to: "tokens", at: 2, tone: "green" }, { id: "e4", from: "tokens", to: "cost", at: 3, label: "÷" },
      { id: "e7", from: "idle", to: "cost", at: 3, tone: "red", label: "fewer tokens to share the cost" },
      { id: "e5", from: "price", to: "margin", at: 5, tone: "green" }, { id: "e6", from: "cost", to: "margin", at: 5, tone: "red" }
    ],
    steps: [
      { caption: "You pay for a GPU by the hour, about $3 here, whether it is working or not.", focus: ["gpu"] },
      { caption: "Only part of the hour is billable work. The rest is idle, between traffic peaks or held in reserve, but it is still paid for.", flow: ["e1", "e2"], focus: ["work", "idle"] },
      { caption: "The busy part produces tokens. 3,000 tokens a second for 60% of an hour is about 6.5 million tokens.", flow: ["e3"], focus: ["tokens"] },
      { caption: "Cost per token is the hour's cost divided by the tokens served: $3 ÷ 6.5 M ≈ $0.46 per million. Idle time spreads the same cost over fewer tokens.", flow: ["e4", "e7"], focus: ["cost"] },
      { caption: "Customers pay list price per token. With three input tokens for every output token on Mistral Large 4, the blended price is about $1.05 per million.", focus: ["price"] },
      { caption: "Gross margin is the gap: (1.05 − 0.46) ÷ 1.05 ≈ 56%. Keep GPUs busy and it grows. Let them idle and it disappears.", flow: ["e5", "e6"], focus: ["margin"] }
    ]
  },
  request: {
    title: "One request, from prompt to answer", w: 940, h: 360,
    nodes: [
      { id: "app", x: 90, y: 180, w: 150, label: "Your app", sub: "sends a prompt", icon: "user", tone: "grey", at: 0 },
      { id: "tok", x: 275, y: 180, w: 160, label: "Tokeniser", sub: "text into tokens", icon: "doc", tone: "purple", at: 1 },
      { id: "prefill", x: 480, y: 80, label: "Prefill", sub: "whole prompt at once", icon: "bolt", tone: "blue", at: 2 },
      { id: "kv", x: 440, y: 285, label: "KV cache", sub: "key and value per token", icon: "memory", tone: "purple", at: 2 },
      { id: "decode", x: 700, y: 180, label: "Decode loop", sub: "one token per step", icon: "model", tone: "orange", at: 3 },
      { id: "weights", x: 700, y: 310, label: "Model weights", sub: "read every step", icon: "layers", tone: "grey", at: 4 },
      { id: "out", x: 865, y: 80, w: 140, label: "Streamed", sub: "to the user", icon: "speaker", tone: "green", at: 5 }
    ],
    edges: [
      { id: "a1", from: "app", to: "tok", at: 1 }, { id: "a2", from: "tok", to: "prefill", at: 2, tone: "blue" },
      { id: "a3", from: "prefill", to: "kv", at: 2, label: "writes", tone: "purple" }, { id: "a4", from: "prefill", to: "decode", at: 3, label: "first token" },
      { id: "a5", from: "kv", to: "decode", at: 4, bend: -35, label: "reads", tone: "purple" }, { id: "a8", from: "decode", to: "kv", at: 4, bend: -35, label: "appends", tone: "purple" },
      { id: "a6", from: "weights", to: "decode", at: 4, tone: "grey" }, { id: "a7", from: "decode", to: "out", at: 5, tone: "green" }
    ],
    steps: [
      { caption: "Your app sends a prompt: system instructions, chat history, any retrieved documents and the question.", focus: ["app"] },
      { caption: "The tokeniser splits the text into tokens, roughly three quarters of an English word each. From here on everything is counted, and billed, in tokens.", flow: ["a1"], focus: ["tok"] },
      { caption: "Prefill: the GPU processes every prompt token in parallel and stores a key and a value for each in the KV cache. It is compute heavy, and it sets time to first token.", flow: ["a2", "a3"], focus: ["prefill", "kv"] },
      { caption: "The first output token appears. Time to first token is the time spent queueing plus prefill.", flow: ["a4"], focus: ["decode"] },
      { caption: "Decode: for every new token the GPU reads all the model weights and the whole KV cache, then appends the new token's key and value. One token per step, so speed is limited by memory bandwidth.", flow: ["a5", "a6", "a8"], focus: ["decode", "weights", "kv"] },
      { caption: "Tokens stream to the user as they are made. Output speed in tokens per second is how fast the answer appears to type itself.", flow: ["a7", "a5", "a6"], focus: ["out"] }
    ]
  },
  memory: {
    title: "What fills a GPU's memory", w: 940, h: 360,
    nodes: [
      { id: "hbm", x: 460, y: 170, w: 240, h: 92, label: "GPU memory (HBM)", sub: "80 GB on one H100", icon: "memory", tone: "purple", at: 0 },
      { id: "weights", x: 130, y: 80, label: "Model weights", sub: "7B × 2 bytes ≈ 14.6 GB", icon: "layers", tone: "blue", at: 1 },
      { id: "over", x: 130, y: 270, label: "Runtime overhead", sub: "about 10%", icon: "gpu", tone: "grey", at: 2 },
      { id: "ra", x: 790, y: 60, w: 230, label: "Request A", sub: "32k tokens, 4.3 GB KV, grows with context", icon: "user", tone: "orange", at: 3 },
      { id: "rb", x: 800, y: 170, label: "Requests B to M", sub: "4.3 GB KV each", icon: "user", tone: "orange", at: 4 },
      { id: "rc", x: 800, y: 280, label: "Request 14", sub: "does not fit", icon: "user", tone: "red", at: 5 },
      { id: "prec", x: 460, y: 315, w: 200, label: "FP8 KV cache", sub: "half the bytes", icon: "bolt", tone: "green", at: 6 }
    ],
    edges: [
      { id: "m1", from: "weights", to: "hbm", at: 1, label: "fixed", tone: "blue" }, { id: "m2", from: "over", to: "hbm", at: 2, tone: "grey" },
      { id: "m3", from: "ra", to: "hbm", at: 3 }, { id: "m4", from: "rb", to: "hbm", at: 4 },
      { id: "m5", from: "rc", to: "hbm", at: 5, tone: "red" }, { id: "m6", from: "prec", to: "hbm", at: 6, tone: "green" }
    ],
    steps: [
      { caption: "A GPU has a fixed pool of very fast memory called HBM. Everything the model needs while serving has to fit in it.", focus: ["hbm"] },
      { caption: "First the weights: parameters × bytes per parameter. A 7B model at FP16, 2 bytes each, is about 14.6 GB. That is fixed however many users you have.", flow: ["m1"], focus: ["weights", "hbm"] },
      { caption: "The serving software needs working space for activations and buffers. Planners allow about 10%.", flow: ["m2"], focus: ["over"] },
      { caption: "Every request needs KV cache for each token in its context. Here that is 128 KB per token, so a 32k-token conversation takes about 4.3 GB.", flow: ["m3"], focus: ["ra"] },
      { caption: "Memory left after weights and overhead, divided by KV cache per request, is how many requests fit at once. About 13 here.", flow: ["m3", "m4"], focus: ["rb", "hbm"] },
      { caption: "Request 14 does not fit. It waits or is turned away, and users feel that as latency or errors.", flow: ["m5"], focus: ["rc"], subs: { rc: "waits or is turned away" } },
      { caption: "Levers: store the KV cache in FP8 (1 byte instead of 2), quantise the weights, cap context or add GPUs. FP8 KV cache roughly doubles the requests that fit.", flow: ["m6"], focus: ["prec", "hbm"], subs: { ra: "32k tokens, 2.1 GB KV", rb: "2.1 GB KV each", rc: "now fits", hbm: "about 26 requests fit" } }
    ]
  },
  batching: {
    title: "Continuous batching", w: 940, h: 360,
    nodes: [
      { id: "q", x: 110, y: 180, label: "Request queue", sub: "users waiting", icon: "queue", tone: "grey", at: 0 },
      { id: "sched", x: 330, y: 180, label: "Scheduler", sub: "builds every step", icon: "router", tone: "purple", at: 1 },
      { id: "batch", x: 560, y: 180, w: 200, label: "Batch of 16", sub: "one token each per step", icon: "layers", tone: "orange", at: 2 },
      { id: "gpu", x: 560, y: 55, w: 200, label: "GPU step", sub: "weights read once, ~13 ms", icon: "gpu", tone: "blue", at: 2 },
      { id: "users", x: 820, y: 180, w: 160, label: "16 users", sub: "75 tokens/s each", icon: "user", tone: "green", at: 3 },
      { id: "done", x: 820, y: 305, w: 160, label: "Finished", sub: "leaves at once", icon: "check", tone: "grey", at: 4 }
    ],
    edges: [
      { id: "b1", from: "q", to: "sched", at: 1 }, { id: "b2", from: "sched", to: "batch", at: 2 },
      { id: "b3", from: "gpu", to: "batch", at: 2, tone: "blue", label: "shared" }, { id: "b4", from: "batch", to: "users", at: 3, tone: "green" },
      { id: "b5", from: "batch", to: "done", at: 4, tone: "grey" }
    ],
    steps: [
      { caption: "Requests wait in a queue. Serving them one at a time leaves the GPU mostly idle, because each decode step is limited by reading the weights, not by the maths.", focus: ["q"] },
      { caption: "The scheduler packs many requests into each decode step.", flow: ["b1"], focus: ["sched"] },
      { caption: "One step reads the weights once and produces a token for every request in the batch. Sixteen tokens for little more than the cost of one.", flow: ["b2", "b3"], focus: ["batch", "gpu"], dots: 5 },
      { caption: "Each user gets their next token. Total throughput is 16 × 75 = 1,200 tokens a second, so cost per token falls sharply.", flow: ["b4"], focus: ["users"], dots: 6 },
      { caption: "Continuous batching: a finished request leaves straight away and a waiting one takes its place at the very next step. The batch never sits half empty waiting for the longest answer.", flow: ["b5", "b1", "b2"], focus: ["done", "sched"] },
      { caption: "The trade-off: bigger batches make every step a bit slower, so each user's speed drops. Pricing tiers decide where each customer sits on that curve.", flow: ["b3", "b4"], focus: ["batch", "users"], subs: { batch: "Batch of 64", users: "64 users, 43 tokens/s each", gpu: "weights read once, ~23 ms" } }
    ]
  },
  speed: {
    title: "Speculative decoding and prefix caching", w: 940, h: 340,
    nodes: [
      { id: "draft", x: 120, y: 85, label: "Draft model", sub: "small and fast", icon: "bolt", tone: "purple", at: 0 },
      { id: "prop", x: 360, y: 85, w: 200, label: "Proposes 4 tokens", sub: "\"the cat sat on\"", icon: "layers", tone: "purple", at: 1 },
      { id: "target", x: 610, y: 85, w: 200, label: "Target model", sub: "checks all 4 in one pass", icon: "model", tone: "blue", at: 2 },
      { id: "acc", x: 840, y: 85, w: 160, label: "Kept", sub: "3 + 1 of its own", icon: "check", tone: "green", at: 3 },
      { id: "req", x: 120, y: 260, label: "New request", sub: "same 6,000-token start", icon: "user", tone: "grey", at: 4 },
      { id: "cache", x: 360, y: 260, w: 200, label: "Prefix cache", sub: "KV for the shared prompt", icon: "db", tone: "teal", at: 4 },
      { id: "skip", x: 610, y: 260, w: 200, label: "Prefill skipped", sub: "billed as cached input", icon: "money", tone: "green", at: 5 }
    ],
    edges: [
      { id: "s1", from: "draft", to: "prop", at: 1, tone: "purple" }, { id: "s2", from: "prop", to: "target", at: 2, tone: "purple" },
      { id: "s3", from: "target", to: "acc", at: 3, tone: "green" }, { id: "s4", from: "req", to: "cache", at: 4, tone: "teal" },
      { id: "s5", from: "cache", to: "skip", at: 5, tone: "green" }
    ],
    steps: [
      { caption: "Normally the big model makes one token per pass. Speculative decoding adds a small draft model that is cheap to run.", focus: ["draft"] },
      { caption: "The draft model quickly guesses the next few tokens.", flow: ["s1"], focus: ["prop"] },
      { caption: "The big target model checks all the guesses in a single pass, which costs about the same as producing one token.", flow: ["s2"], focus: ["target"] },
      { caption: "It keeps the guesses up to the first wrong one and adds its own token. Several tokens per pass, identical output, lower latency. The gain depends on how often the draft is right.", flow: ["s3"], focus: ["acc"] },
      { caption: "A different trick. Many requests start with the same long system prompt, so prefix caching keeps the KV cache for that shared start.", flow: ["s4"], focus: ["req", "cache"] },
      { caption: "Later requests reuse it instead of recomputing it. That is why cached input is priced up to 90% lower on Mistral's API.", flow: ["s5"], focus: ["skip"] }
    ]
  },
  platform: {
    title: "Inside a managed inference API", w: 960, h: 370,
    nodes: [
      { id: "dev", x: 85, y: 185, w: 140, label: "Developer", sub: "API key", icon: "user", tone: "grey", at: 0 },
      { id: "gw", x: 260, y: 185, w: 160, label: "Gateway", sub: "auth, limits, abuse", icon: "shield", tone: "orange", at: 1 },
      { id: "router", x: 450, y: 185, w: 160, label: "Router", sub: "tier queues", icon: "router", tone: "purple", at: 2 },
      { id: "std", x: 660, y: 60, label: "Shared pool", sub: "Standard and Priority", icon: "gpu", tone: "blue", at: 3 },
      { id: "reg", x: 660, y: 165, label: "EU region pool", sub: "10% premium", icon: "globe", tone: "teal", at: 3 },
      { id: "bat", x: 660, y: 270, label: "Batch capacity", sub: "within 24 hours", icon: "clock", tone: "grey", at: 4 },
      { id: "ded", x: 450, y: 330, w: 190, label: "Dedicated endpoint", sub: "one customer", icon: "gpu", tone: "yellow", at: 5 },
      { id: "meter", x: 875, y: 185, w: 150, label: "Metering", sub: "tokens × price × tier", icon: "meter", tone: "green", at: 6 }
    ],
    edges: [
      { id: "p1", from: "dev", to: "gw", at: 1 }, { id: "p2", from: "gw", to: "router", at: 2 },
      { id: "p3", from: "router", to: "std", at: 3, tone: "blue" }, { id: "p4", from: "router", to: "reg", at: 3, tone: "teal" },
      { id: "p5", from: "router", to: "bat", at: 4, tone: "grey" }, { id: "p6", from: "gw", to: "ded", at: 5, tone: "yellow" },
      { id: "p7", from: "std", to: "meter", at: 6, tone: "green" }, { id: "p8", from: "reg", to: "meter", at: 6, tone: "green" },
      { id: "p9", from: "bat", to: "meter", at: 6, tone: "green" }, { id: "p10", from: "ded", to: "meter", at: 6, tone: "green", bend: 40 }
    ],
    steps: [
      { caption: "A developer calls the API with a key. Who they are, a free tier user, a scale-up or a regulated enterprise, shapes everything that follows.", focus: ["dev"] },
      { caption: "The gateway checks the key, applies rate limits in requests and tokens per minute, and stops abuse. Free tier fraud is fought here.", flow: ["p1"], focus: ["gw"] },
      { caption: "The router picks a queue. Priority Tier requests go ahead of Standard under load and fall back to Standard when they exceed their limit.", flow: ["p2"], focus: ["router"] },
      { caption: "Most traffic runs on shared GPU pools. Regional endpoints keep processing in the EU or US for a 10% premium.", flow: ["p3", "p4"], focus: ["std", "reg"] },
      { caption: "Batch work waits for spare capacity and finishes within 24 hours, which is why it can be cheaper.", flow: ["p5"], focus: ["bat"] },
      { caption: "Large, steady customers can reserve a dedicated endpoint: predictable latency and isolation, priced on capacity rather than tokens.", flow: ["p6"], focus: ["ded"] },
      { caption: "Metering counts input, cached input and output tokens, applies tier and region multipliers, and turns usage into revenue.", flow: ["p7", "p8", "p9", "p10"], focus: ["meter"] }
    ]
  },
  customise: {
    title: "Retrieval and LoRA, side by side", w: 940, h: 340,
    nodes: [
      { id: "q", x: 95, y: 80, w: 160, label: "Question", sub: "about a policy", icon: "user", tone: "grey", at: 0 },
      { id: "emb", x: 290, y: 80, label: "Embedding model", sub: "text into a vector", icon: "model", tone: "purple", at: 1 },
      { id: "vdb", x: 505, y: 80, label: "Vector database", sub: "finds nearest chunks", icon: "db", tone: "teal", at: 1 },
      { id: "prompt", x: 770, y: 80, w: 190, label: "Prompt + chunks", sub: "grounded context", icon: "doc", tone: "blue", at: 2 },
      { id: "llm", x: 610, y: 260, label: "Base model", sub: "frozen, shared", icon: "model", tone: "blue", at: 3 },
      { id: "lora", x: 845, y: 260, w: 170, label: "LoRA adapter", sub: "small, per customer", icon: "plug", tone: "orange", at: 4 },
      { id: "ans", x: 320, y: 260, w: 190, label: "Answer", sub: "grounded, in their style", icon: "check", tone: "green", at: 5 }
    ],
    edges: [
      { id: "c1", from: "q", to: "emb", at: 1 }, { id: "c2", from: "emb", to: "vdb", at: 1, tone: "teal" },
      { id: "c3", from: "vdb", to: "prompt", at: 2, tone: "teal" }, { id: "c4", from: "prompt", to: "llm", at: 3, tone: "blue" },
      { id: "c5", from: "lora", to: "llm", at: 4 }, { id: "c6", from: "llm", to: "ans", at: 5, tone: "green" }
    ],
    steps: [
      { caption: "Customers want answers grounded in their own documents. Start with retrieval, not retraining.", focus: ["q"] },
      { caption: "An embedding model turns the question into a vector, a list of numbers that captures meaning, and the vector database finds the document chunks with the closest meaning.", flow: ["c1", "c2"], focus: ["emb", "vdb"] },
      { caption: "Those chunks are added to the prompt, so the model answers from the customer's own, current content.", flow: ["c3"], focus: ["prompt"] },
      { caption: "The base model generates the answer. Its weights are frozen and shared by every customer.", flow: ["c4"], focus: ["llm"] },
      { caption: "When the gap is behaviour or style rather than knowledge, a LoRA adapter, a small set of extra weights trained for one customer, is applied to the base model at serving time.", flow: ["c5"], focus: ["lora"] },
      { caption: "The result is a grounded answer in the customer's own format. Many adapters can share one base model on the same GPUs.", flow: ["c6", "c5"], focus: ["ans"] }
    ]
  },
  proving: {
    title: "A fair bake-off", w: 940, h: 350,
    nodes: [
      { id: "set", x: 110, y: 175, label: "Frozen test set", sub: "versioned, human checked", icon: "doc", tone: "grey", at: 0 },
      { id: "cur", x: 360, y: 80, label: "Current system", sub: "the customer's baseline", icon: "gpu", tone: "grey", at: 1 },
      { id: "new", x: 360, y: 270, label: "New system", sub: "your model and platform", icon: "gpu", tone: "orange", at: 1 },
      { id: "score", x: 600, y: 175, label: "Same scoring", sub: "rules agreed in advance", icon: "check", tone: "purple", at: 2 },
      { id: "seg", x: 840, y: 70, w: 170, label: "By segment", sub: "weak types, language", icon: "layers", tone: "blue", at: 3 },
      { id: "lat", x: 840, y: 175, w: 170, label: "Latency budget", sub: "p50, p95, p99", icon: "clock", tone: "yellow", at: 4 },
      { id: "safe", x: 840, y: 280, w: 170, label: "Safety", sub: "caught and wrongly blocked", icon: "shield", tone: "green", at: 5 }
    ],
    edges: [
      { id: "f1", from: "set", to: "cur", at: 1, tone: "grey" }, { id: "f2", from: "set", to: "new", at: 1 },
      { id: "f3", from: "cur", to: "score", at: 2, tone: "grey" }, { id: "f4", from: "new", to: "score", at: 2 },
      { id: "f5", from: "score", to: "seg", at: 3, tone: "blue" }, { id: "f6", from: "score", to: "lat", at: 4, tone: "yellow" },
      { id: "f7", from: "score", to: "safe", at: 5, tone: "green" }
    ],
    steps: [
      { caption: "Agree a frozen test set with the customer before anything runs: representative, versioned, with human-checked answers.", focus: ["set"] },
      { caption: "Run the customer's current system and yours on exactly the same inputs and conditions.", flow: ["f1", "f2"], focus: ["cur", "new"] },
      { caption: "Score both with the same rules, agreed in writing. Otherwise any result can be argued away.", flow: ["f3", "f4"], focus: ["score"] },
      { caption: "Report by segment, not just the average. Weak document types, difficult languages and hard questions are where the value is decided.", flow: ["f5"], focus: ["seg"] },
      { caption: "Treat latency as a budget, measured end to end at p50, p95 and p99, especially for voice.", flow: ["f6"], focus: ["lat"] },
      { caption: "For guardrails, report how much unsafe content is caught and how many genuine users are blocked, by category. Then the customer can decide.", flow: ["f7"], focus: ["safe"] }
    ]
  }
};
