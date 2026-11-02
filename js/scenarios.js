/* Fictional teaching scenarios. Every record, number and example below is synthetic. */
window.APPLIED_SCENARIOS = [
  {
    id: "documents", label: "Document extraction", title: "Turn messy documents into usable records", short: "OCR, extraction and downstream correctness",
    topics: ["llm","evaluation"], lessons: ["customise","proving","economics"],
    problem: "A service team receives a mixture of digital forms, faint scans and handwritten requests. Staff need correct structured records, not just readable OCR text. A new pipeline should reduce manual correction without quietly damaging the document types that already work.",
    decision: "Which document groups should move to a candidate pipeline, and which should retain a review step?",
    concepts: [
      ["OCR is not the final answer", "Character recognition, field extraction, interpretation and classification are separate failure points. Score the final required fields against a human-reviewed reference."],
      ["Measure the right unit", "Field-level accuracy and whole-document success are not interchangeable. One wrong mandatory field can make a document unusable even when most fields are right."],
      ["Capacity follows the workload", "Pages per request, image resolution, tokenised output, concurrency and retries all affect cost. Do not convert a document count directly into GPU requirements."]
    ],
    flow: [
      ["Input documents","representative groups","doc","Freeze a representative sample and record its document categories. Keep a separate set for prompt tuning."],
      ["Read the page","OCR and layout","search","Extract text and layout cues. Record unreadable or uncertain content instead of silently inventing it."],
      ["Interpret fields","structured schema","model","Map the extracted content into required fields and a document class. Normalise values only using agreed rules."],
      ["Validate","schema and evidence","shield","Check mandatory fields, valid values and source support. A valid JSON response can still contain the wrong answer."],
      ["Compare","same scoring rules","check","Score the baseline and candidate on identical inputs. Report each document group before aggregating."],
      ["Review or release","explicit routing policy","user","Use the evidence to decide which outputs require human review. Keep an audit trail and a rollback route."]
    ],
    data: {
      caption:"Invented field-scoring results. Counts are required fields, not documents.",
      columns:["Document group","Fields scored","Baseline correct","Candidate correct"],
      rows:[["Clean forms","125","120","119"],["Faint scans","70","35","49"],["Handwritten forms","55","20","31"]]
    },
    worked: [
      "Baseline: (120 + 35 + 20) / 250 = 70.0%. Candidate: (119 + 49 + 31) / 250 = 79.6%. The overall gain is 9.6 percentage points, not 9.6% relative growth.",
      "Faint scans improve from 50% to 70%, but clean forms fall from 96% to 95.2%. The average cannot tell you whether that regression is acceptable.",
      "This toy table has no field-criticality labels, repeated-run variation, whole-document scores or latency measurements. It is not enough to authorise a rollout."
    ],
    evaluate: [
      "Version the documents, human-reviewed field references, normalisation rules and pipeline configurations.",
      "Score mandatory fields and document classes by segment. Inspect mismatches and invalid or missing output separately.",
      "Measure document submission to validated structured record, including preprocessing, model work and retries. Streaming TTFT may be irrelevant to the actual user task.",
      "Separate tuning and held-out evaluation sets. Report human-review effort, repeatability and cost per usable document."
    ],
    control: "Document images, extracted text, prompts, outputs, review queues and logs can all carry sensitive information. Map their storage, access and retention; a locally hosted model alone does not establish control over the full pipeline.",
    question: "The aggregate field score improved. What is the strongest next step?",
    choices: [
      {text:"Replace every document path immediately.", feedback:"The aggregate hides the clean-form regression and says nothing about critical fields, latency or review effort. A higher average is not a rollout decision.", correct:false},
      {text:"Check segment-level failures and critical fields before deciding the rollout scope.", feedback:"Yes. Establish whether the gains meet the agreed needs, whether the regression is tolerable and which document groups still need human review.", correct:true},
      {text:"Report the OCR character score instead of the structured-output score.", feedback:"Better OCR can still feed incorrect field interpretation. The outcome needed by the service team is the usable structured record.", correct:false}
    ]
  },
  {
    id: "retrieval", label: "Retrieval quality", title: "Replace a search component without breaking answers", short: "Retrieval quality versus answer quality",
    topics: ["retrieval","llm","evaluation"], lessons: ["customise","memory","speed","proving"],
    problem: "A support assistant answers questions from a small policy library. A team wants to change the retrieval layer. The demonstration must show whether the system finds the right evidence and whether the model uses that evidence correctly.",
    decision: "Is the failure in the search layer, the answer generation, or the absence of an approved source?",
    concepts: [
      ["Retrieval is an upstream dependency", "A fluent answer cannot repair a missing authoritative passage. Evaluate the retrieved set independently from the generated answer."],
      ["Citations need checking", "A citation proves where a passage came from, not that it supports the answer. Check the relationship between the claim and the cited text."],
      ["A small test is not a scale proof", "Production readiness also depends on index size, update rates, access filters, ingestion, concurrency and recovery. List those gaps explicitly."]
    ],
    flow: [
      ["Public test corpus","versioned policies","doc","Prepare a synthetic policy library with authoritative answers and questions that cannot be answered from it."],
      ["Question","expected evidence","user","Record the relevant document IDs and expected answer or abstention for each question."],
      ["Retrieve","rank and filter","search","Run the baseline and candidate retrieval systems on the same corpus and question set."],
      ["Build context","evidence budget","layers","Select relevant passages within a context budget, retaining provenance and access constraints."],
      ["Answer","cite or abstain","model","Generate a response grounded in the supplied evidence. Do not substitute a plausible answer when the corpus has none."],
      ["Evaluate twice","retrieval and generation","check","Inspect retrieval relevance separately from answer correctness, support and citation accuracy."]
    ],
    data: {
      caption:"Three fictional query traces. The policy facts are invented for this exercise.",
      columns:["Question","Authoritative evidence","Retrieved context","Assistant output"],
      rows:[
        ["How long can I borrow demo equipment?","R1: A demo loan lasts 8 days.","R2: A return-shipping label expires after 3 days.","You can borrow it for 3 days. [R2]"],
        ["Can I return an opened accessory?","R3: Only unopened accessories are eligible.","R3: Only unopened accessories are eligible.","Yes, opened accessories are eligible. [R3]"],
        ["What overseas import tax will I pay?","No approved policy in this corpus.","No relevant result.","I cannot determine that from the available policy."]
      ]
    },
    worked: [
      "The first answer fails upstream: the relevant loan policy was not retrieved. Changing the answer's tone will not fix the missing evidence.",
      "The second trace retrieves the correct rule but contradicts it. That is a generation or instruction-following failure, despite having a citation.",
      "The third answer correctly abstains for this test. Count unsupported confident answers separately from appropriate abstentions."
    ],
    evaluate: [
      "Freeze corpus versions, questions and human relevance judgements. Define expected abstentions.",
      "Use retrieval measures such as recall at k where the relevant set is known; report answer correctness, groundedness and citation support separately.",
      "Hold application-level comparison conditions constant. Tune systems on a separate development set and record configuration differences.",
      "Measure ingestion/update behaviour, TTFT, final-answer latency and errors. A small corpus and three queries cannot establish production scale."
    ],
    control: "Access-filter the retrieved content before it reaches the model. Include embeddings, indexes, caches, citations and diagnostic traces in the data-control map; deleting a source document must have a defined downstream effect.",
    question: "In the second trace, where should you investigate first?",
    choices: [
      {text:"The generation step: it contradicts the correct retrieved passage.", feedback:"Yes. The approved evidence is already present. Check instruction handling, context construction and how the model uses that evidence; preserve the retrieval result as a separate success.", correct:true},
      {text:"Increase the number of retrieved passages without inspecting the answer.", feedback:"More context can add cost and noise. Here the relevant passage was found, so first inspect why the answer contradicts it.", correct:false},
      {text:"Accept the response because it includes a source citation.", feedback:"The citation points to a source that says the opposite. Citation presence and evidential support are different checks.", correct:false}
    ]
  },
  {
    id: "permissions", label: "Identity & permissions", title: "Make an assistant respect identity and authority", short: "Documents, messages and bounded tool actions",
    topics: ["agents","retrieval","sovereignty","evaluation"], lessons: ["platform","memory","proving"],
    problem: "An internal assistant can read documents, search a shared inbox and draft a service response. Users have different access rights. A useful answer must not expose another role's records, and permission to read must not silently become permission to send.",
    decision: "Can the assistant complete the task under the caller's authority, with evidence of every access and action?",
    concepts: [
      ["Identity must survive each hop", "Apply authorisation at retrieval and tool execution, using the caller's effective permissions. A model instruction to respect access is not an enforcement mechanism."],
      ["Connectivity is not permission", "A tool protocol connects systems; it does not by itself grant or validate authority. The service must verify identity, scope and the requested action."],
      ["Read, draft and send are separate", "Preparing content is not the same as committing a change. Define when approval is required and how duplicate or failed actions are handled."]
    ],
    flow: [
      ["Request + identity","caller and task","user","Start with an authenticated caller and a specific requested task. Determine the tenant, role and resource scope."],
      ["Policy check","effective authority","shield","Establish which content and tool actions are authorised. Reject missing or untrusted identity claims."],
      ["Read evidence","allowed sources only","search","Filter documents and messages before adding them to the model context. Keep returned source identities."],
      ["Propose action","bounded tool call","model","Validate the proposed operation and arguments. Treat instructions found in retrieved documents as data, not authority."],
      ["Approve + execute","recheck permissions","gateway","Request confirmation for actions that require it, recheck permissions and use idempotency controls where appropriate."],
      ["Verify outcome","auditable trace","check","Record actual tool results and side effects. A confident model message is not proof that the action succeeded."]
    ],
    data: {
      caption:"Invented identities, resources and expected policy outcomes. No real account or message data.",
      columns:["Identity","Request","Policy condition","Expected outcome"],
      rows:[
        ["Requester A","Read the service handbook","All staff may read","Allow; cite authorised content"],
        ["Requester A","Read restricted supplier terms","Reviewer role required","Deny without exposing contents or sensitive metadata"],
        ["Reviewer B","Read restricted supplier terms","Reviewer role present","Allow only the requested authorised scope"],
        ["Requester A","Send a response from the shared inbox","Draft allowed; send requires approval","Create a draft; do not send before approval"]
      ]
    },
    worked: [
      "Run the same retrieval request as both identities. Correct content for one caller can be a disclosure for another.",
      "Test missing identity, revoked access, cached results and tool errors. Repeat checks after a permission change, not only after sign-in.",
      "For the final row, a successful draft is not a successful send. Check the tool trace and final system state rather than the assistant's wording."
    ],
    evaluate: [
      "Version the personas, resource permissions, question set and task scripts. Use synthetic documents and inbox items.",
      "Score authorised relevance, unsupported claims, denied-access behaviour, actual task completion and unintended side effects separately.",
      "Retain appropriately protected retrieval IDs, citations, policy decisions and tool outcomes. Minimise sensitive content in logs.",
      "Test revoked access, permission-aware caching, tool timeouts and repeat submissions. Define retries and approval rules before the test."
    ],
    control: "Map who administers identity, connectors, keys, caches, logs and tool credentials. A model inside the right geography can still disclose data through an overprivileged connector or a shared cache.",
    question: "The assistant can read an inbox. Does that authorise it to send a message?",
    choices: [
      {text:"Yes, because read access implies authority over the same mailbox.", feedback:"Read and write permissions are distinct. Sending can create an external side effect and needs its own authorisation and approval policy.", correct:false},
      {text:"Yes, if the system prompt says that the assistant is trusted.", feedback:"A prompt cannot confer access rights. Enforce policy at the service and tool boundary, not by relying on model compliance.", correct:false},
      {text:"No. Validate send authority and any required approval before execution.", feedback:"Yes. Preserve the caller's effective permissions, validate the specific action and retain evidence of the actual result.", correct:true}
    ]
  },
  {
    id: "voice", label: "Voice latency", title: "Budget the wait in a voice conversation", short: "First token is not first audible response",
    topics: ["agents","gpu","evaluation"], lessons: ["request","batching","speed","proving"],
    problem: "A voice assistant seems fast in a text playground but leaves callers waiting. The team needs to locate the delay across speech processing, retrieval, model generation and audio delivery instead of treating model speed as the whole experience.",
    decision: "Which interval describes the caller's wait, and which stage is worth changing first?",
    concepts: [
      ["Name the timing boundary", "LLM TTFT begins when the model receives its prompt. The caller's wait begins earlier, for example when speech ends, and finishes when audio becomes audible."],
      ["Streaming changes the dependency graph", "Speech may begin from an early chunk rather than waiting for the full answer. That can reduce first-audio latency without reducing total completion time."],
      ["Tail latency matters", "A single trace or average does not describe the worst regular experience. Measure the distribution under load and include errors, interruptions and retries."]
    ],
    flow: [
      ["Speech ends","start the user clock","mic","Define the user-facing boundary at the end of the utterance. Keep call setup separate if it is outside this measurement."],
      ["Recognise speech","final usable text","doc","Record turn detection and speech-recognition timing. Background noise and accent variation belong in the test set."],
      ["Retrieve context","relevant evidence","search","Fetch useful evidence without unnecessarily inflating the prompt. Record source and retrieval timing."],
      ["Generate","first usable chunk","model","Measure queue time and model TTFT. Distinguish the first token from the first text chunk usable by speech synthesis."],
      ["Synthesise","first audio chunk","speaker","Record the time to usable audio and whether synthesis waits for the full answer or streams from an early chunk."],
      ["Caller hears audio","stop the user clock","clock","Include transport and playback buffering. Correlate timestamps rather than adding unrelated stage averages."]
    ],
    data: {
      caption:"One invented serial trace, milliseconds from speech end. Real stages can overlap; this is not a benchmark.",
      columns:["Stage","Starts at (ms)","Ends at (ms)","Elapsed (ms)"],
      rows:[["Turn detection","0","80","80"],["Final speech recognition","80","320","240"],["Retrieval","320","480","160"],["Model to first usable chunk","480","790","310"],["Speech synthesis to first chunk","790","980","190"],["Transport and playback buffer","980","1050","70"]]
    },
    worked: [
      "Caller wait: 1050 - 0 = 1050 ms. Model plus first-chunk synthesis: 980 - 480 = 500 ms. Those are different measurement boundaries.",
      "A hypothetical 100 ms reduction in retrieval shortens this serial trace to 950 ms if all other timings stay unchanged. It is not evidence that a specific model or product can achieve that change.",
      "Do not add per-stage p95 values and label the sum end-to-end p95. Measure whole-request durations from correlated traces, including overlaps and queueing."
    ],
    evaluate: [
      "Version the prompts, audio, expected answers, streaming policy and timing boundaries.",
      "Compare speech-end-to-first-audio, model TTFT and full response completion as separate measures.",
      "Test warm and cold paths, concurrency, noisy audio and interruption handling. Report p50/p95/p99 and failures.",
      "Assess answer correctness, intelligibility and tool selection when tools are part of the task. Faster incorrect responses are not a success."
    ],
    control: "Trace audio, transcripts, retrieved content and generated speech through every endpoint. Data location, retention and operator access may differ across speech recognition, retrieval, model serving and synthesis.",
    question: "What caller-perceived first-audio latency does this synthetic trace demonstrate?",
    choices: [
      {text:"310 ms, because that is the model's first-chunk time.", feedback:"That excludes speech processing, retrieval, synthesis and delivery. It is one component interval, not the caller's wait.", correct:false},
      {text:"500 ms, because model generation and speech synthesis are the AI stages.", feedback:"That is a useful segment measurement, but the caller also waits before and after that segment.", correct:false},
      {text:"1050 ms, from speech end to audible playback.", feedback:"Correct for this explicitly serial toy trace. Report the 500 ms model/synthesis segment separately and collect many full-flow traces to assess tail latency.", correct:true}
    ]
  },
  {
    id: "guardrails", label: "Guardrail trade-offs", title: "Choose guardrails without hiding their mistakes", short: "Missed unsafe requests versus blocked legitimate work",
    topics: ["evaluation","agents","sovereignty"], lessons: ["proving","request","economics"],
    problem: "A service must screen requests without unnecessarily blocking legitimate users. Two candidate policies produce different mistakes. The team needs to compare detection quality, false alarms, latency and failure behaviour, not just a single accuracy score.",
    decision: "What trade-off is acceptable for this task, and what happens if the guardrail is unavailable?",
    concepts: [
      ["Class balance can flatter accuracy", "When most requests are safe, a policy that allows everything can have a high overall accuracy while catching nothing unsafe."],
      ["Precision and recall answer different questions", "Recall asks what fraction of labelled unsafe requests were caught. Precision asks what fraction of blocked requests were actually unsafe. False-positive rate uses all safe requests as its denominator."],
      ["Enforcement has operational consequences", "Input checks can delay first-token delivery. Output checks can interact with streaming. Timeouts and fail-safe behaviour are part of the policy."]
    ],
    flow: [
      ["Labelled test set","shared category rules","doc","Prepare safe and unsafe labels with a clear taxonomy and review disagreement. Keep the final evaluation set held out."],
      ["Policy variants","same inputs","shield","Run each candidate policy on exactly the same examples and conditions, retaining per-example decisions."],
      ["Confusion matrix","four outcomes","layers","Count true positives, false negatives, false positives and true negatives using consistent positive-class definitions."],
      ["Slice the results","category and language","search","Inspect where errors concentrate. Overall metrics can hide poor performance in one language, category or user task."],
      ["Time + failure tests","overhead and timeouts","clock","Measure isolated and end-to-end overhead. Test unavailable services, retries and the agreed fail-safe route."],
      ["Policy decision","explicit tolerances","check","Choose only after agreeing acceptable misses, false alarms and latency. Record the remaining risks and review process."]
    ],
    data: {
      caption:"Invented evaluation set: 40 unsafe and 360 safe requests. Positive means labelled unsafe.",
      columns:["Policy","TP: unsafe blocked","FN: unsafe allowed","FP: safe blocked","TN: safe allowed"],
      rows:[["Allow everything","0","40","0","360"],["Stricter policy","36","4","54","306"],["More permissive policy","28","12","9","351"]]
    },
    worked: [
      "Allow everything: accuracy = 360 / 400 = 90%, but unsafe recall = 0 / 40 = 0%. High accuracy alone is misleading.",
      "Stricter policy: recall = 36 / 40 = 90%; false-positive rate = 54 / 360 = 15%; precision = 36 / 90 = 40%; accuracy = 342 / 400 = 85.5%.",
      "More permissive policy: recall = 28 / 40 = 70%; false-positive rate = 9 / 360 = 2.5%; precision = 28 / 37, about 75.7%; accuracy = 379 / 400 = 94.75%.",
      "These aggregate counts contain no category, language, latency or repeatability information. They cannot establish production safety or compliance."
    ],
    evaluate: [
      "Approve the label taxonomy and freeze a reviewed test set. Report sample counts, ambiguity and reviewer agreement.",
      "Compare confusion matrices, recall, precision and false-positive rates by relevant category and language, not only overall.",
      "Measure guardrail overhead and whole-request p50/p95/p99 under comparable load. Include the effects of output buffering on streaming.",
      "Document enforcement points, policy version, timeout rules, safe fallback and human review. Test failures rather than assuming a service always responds."
    ],
    control: "A guardrail may process the same sensitive inputs and outputs as the main model. Include its runtime, logs, policy administrators and escalation path in the control map. It supplements access controls; it does not replace them.",
    question: "Which conclusion can you justify from this table alone?",
    choices: [
      {text:"The more permissive policy wins because it has the highest accuracy.", feedback:"It misses more unsafe requests. Accuracy does not encode the cost of those misses or the consequences of false alarms.", correct:false},
      {text:"The trade-off is visible, but selection needs agreed recall, false-positive and latency requirements.", feedback:"Yes. The table helps expose the choice; it does not set the acceptance policy. Add category-level evidence, latency and failure testing before making a deployment decision.", correct:true},
      {text:"The stricter policy is always safe because its recall is higher.", feedback:"It still misses labelled unsafe requests and blocks many legitimate ones. Neither a relative improvement nor a small toy test establishes safety.", correct:false}
    ]
  }
];

for (const scenario of window.APPLIED_SCENARIOS) {
  const positions = [[140,80],[470,80],[800,80],[800,245],[470,245],[140,245]];
  const tones = ["blue","purple","teal","orange","yellow","green"];
  window.LEARNING_DIAGRAMS[`case-${scenario.id}`] = {
    title: scenario.title, w: 940, h: 330,
    nodes: scenario.flow.map(([label,sub,icon],i)=>({id:`n${i}`,x:positions[i][0],y:positions[i][1],w:230,h:64,label,sub,icon,tone:tones[i],at:i})),
    edges: scenario.flow.slice(1).map((_,i)=>({id:`e${i}`,from:`n${i}`,to:`n${i+1}`,tone:tones[i+1],at:i+1})),
    steps: scenario.flow.map((step,i)=>({caption:step[3],focus:[`n${i}`],flow:i?[`e${i-1}`]:[]}))
  };
}
