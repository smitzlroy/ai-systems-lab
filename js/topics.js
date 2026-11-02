window.LEARNING_TOPICS = [
  {
    id: "inference", title: "Inference", code: "01", label: "Interactive lessons",
    heading: "From a prompt to a running system.",
    intro: "Follow the request. See where the memory goes. Experiment with the trade-offs between speed, capacity and cost.",
    layers: ["APPLICATION", "INFERENCE ENGINE", "GPU + MEMORY"]
  },
  {
    id: "gpu", title: "GPU systems", code: "02",
    heading: "Understand the machine behind the model.",
    intro: "From one accelerator to a cluster: compute, memory, interconnects and the physical limits that shape AI systems.",
    layers: ["CLUSTER", "INTERCONNECT", "ACCELERATOR"],
    modules: [
      ["Inside a GPU", "SMs, tensor cores and parallel execution. Why matrix multiplication suits accelerators, and when it does not."],
      ["Memory is a hierarchy", "HBM capacity and bandwidth, caches, host memory and data movement. Distinguish running out of room from waiting for bytes."],
      ["Beyond one device", "PCIe, NVLink, network fabrics, collectives and model parallelism. Understand when adding GPUs helps and when communication dominates."],
      ["The physical system", "Power, cooling, racks, utilisation and failure domains. Connect hardware choices to service capacity and cost."]
    ],
    experiment: "Planned lab: move a workload between compute-bound, memory-bound and network-bound regimes."
  },
  {
    id: "llm", title: "LLM foundations", code: "03",
    heading: "Know what a language model actually does.",
    intro: "Build a working mental model before diving into model sizes, leaderboards or product claims.",
    layers: ["TOKENS", "TRANSFORMER", "PROBABILITIES"],
    modules: [
      ["Tokens and embeddings", "How text becomes token IDs and vectors. Vocabulary, context windows and why a token is not a word."],
      ["Inside a transformer", "Attention, feed-forward layers, residual connections and positional information. Follow one token through the network."],
      ["Learning versus generating", "Pretraining, instruction tuning and preference optimisation versus inference. Weights, activations and KV cache are different things."],
      ["Choosing a model", "Dense and mixture-of-experts architectures, multimodality, model licences and quality/cost trade-offs. Separate capability from benchmark scores."]
    ],
    experiment: "Planned lab: change sampling temperature and observe a next-token probability distribution."
  },
  {
    id: "retrieval", title: "Retrieval & data", code: "04",
    heading: "Give the model the right information.",
    intro: "Learn how data becomes useful context, and why good retrieval is more than adding a vector database.",
    layers: ["ANSWER", "RETRIEVAL", "GOVERNED DATA"],
    modules: [
      ["Prepare the evidence", "Document parsing, chunking, metadata, freshness and provenance. What gets lost before a model ever sees the data?"],
      ["Find useful context", "Embeddings, lexical search, hybrid search and reranking. Compare relevance, recall and latency."],
      ["Ground an answer", "Context assembly, citations and abstention. Distinguish retrieving a passage from supporting a claim."],
      ["Respect permissions", "Identity-aware retrieval, deletion, tenant isolation and injection through retrieved content."]
    ],
    experiment: "Planned lab: vary chunk size and retrieval depth, then measure answer quality and context cost."
  },
  {
    id: "agents", title: "Agents & tools", code: "05",
    heading: "Move from generating text to taking action.",
    intro: "Understand tool use and orchestration without mistaking an autonomous loop for a reliable system.",
    layers: ["USER INTENT", "CONTROL LOOP", "SCOPED TOOLS"],
    modules: [
      ["Tools and structured outputs", "Schemas, validation and tool results. The model proposes an action; application code decides what can execute."],
      ["Design the control loop", "Workflows versus agents, state, memory, retries and stopping conditions. Keep complexity proportional to the task."],
      ["Bound the authority", "Least privilege, human approval, untrusted inputs and prompt injection. Separate instructions from data."],
      ["Make actions reliable", "Idempotency, budgets, timeouts, traces and recovery. Evaluate task completion, not just fluent explanations."]
    ],
    experiment: "Planned lab: trace a tool-using workflow and inspect every permission and approval boundary."
  },
  {
    id: "evaluation", title: "Evaluation & safety", code: "06",
    heading: "Prove the system works. Know when it does not.",
    intro: "Turn a promising demo into measurable behaviour, with test sets, failure analysis and operational feedback.",
    layers: ["DECISION", "MEASUREMENT", "TEST EVIDENCE"],
    modules: [
      ["Design the evaluation", "Task definitions, representative data, baselines, leakage and held-out sets. Agree the scoring rules before running the test."],
      ["Measure the trade-offs", "Quality, latency, cost and uncertainty. Report by segment, not just one average."],
      ["Test failure and misuse", "Hallucinations, harmful outputs, injection, data exposure and unsafe actions. Use threat models and adversarial tests."],
      ["Operate and improve", "Observability, drift, human feedback, incident response and regression testing."]
    ],
    experiment: "Planned lab: see how an impressive overall score can hide failures in a small but important segment."
  },
  {
    id: "sovereignty", title: "European sovereignty", code: "07",
    heading: "Where it runs is only the first question.",
    intro: "Explore who controls an AI service, who can access its data, which laws apply, and whether you can keep operating or leave.",
    layers: ["LAW + ACCOUNTABILITY", "OPERATIONAL CONTROL", "DATA + INFRASTRUCTURE"],
    modules: [
      ["Control and jurisdiction", "Ownership, operator access, governing law, supply-chain dependencies and authority over updates. Distinguish residency from sovereignty."],
      ["Data and keys", "Personal data, prompts, outputs, logs, backups and support access. Map encryption, key custody, transfers and retention across the full service."],
      ["European regulation", "Study the EU AI Act and GDPR: roles, risk classification, obligations and evidence. Track implementation dates against official sources rather than hard-coding assumptions."],
      ["Resilience and sector rules", "Explore NIS2, DORA and the Data Act alongside national and sector requirements. Establish which rules apply to the organisation and service."],
      ["Technical and operational choices", "Public cloud, dedicated capacity, on-premises and disconnected operation. Compare isolation, auditability, patching and incident-response responsibilities."],
      ["Portability and autonomy", "Model licences, reproducible deployment, switching providers, skills and exit plans. Test whether control survives a supplier outage or contract change."]
    ],
    experiment: "Planned lab: map a service across data, operational, technological and legal control; identify gaps rather than assign a simplistic sovereignty score.",
    sources: [
      ["EU AI Act · European Commission", "https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai"],
      ["GDPR · EUR-Lex", "https://eur-lex.europa.eu/eli/reg/2016/679/oj"],
      ["NIS2 · EUR-Lex", "https://eur-lex.europa.eu/eli/dir/2022/2555/oj"],
      ["DORA · EUR-Lex", "https://eur-lex.europa.eu/eli/reg/2022/2554/oj"],
      ["Data Act · EUR-Lex", "https://eur-lex.europa.eu/eli/reg/2023/2854/oj"]
    ]
  }
];
