PROJECT CONTENT DOCUMENTATION
Portfolio Project Content --- Master Specification for Claude
Purpose: This document is the content and factual specification
Claude should use when adding the user's projects to the portfolio. It
is intentionally focused on the actual projects, their implementation,
technical depth, results, and story. It does not introduce unnecessary
portfolio metadata or expand the application's data model merely for the
sake of adding fields.
---
0. IMPORTANT PROJECT REPRESENTATION RULE — FAKE NEWS PROJECT
The fake-news detection work is a single completed, full-fledged project.
Its primary portfolio identity is:
Cross-Domain Fake News Detection Using Transformer-Driven Ensemble Learning
The user's M.Tech dissertation is the complete technical document for this project. It covers the motivation, problem statement, objectives, contributions, ML/DL implementation, proposed transformer architecture, datasets, preprocessing, ensemble strategies, evaluation protocol, results, external verification, limitations and conclusion.
The GitHub fake-news code that will be added by the user is the implementation repository for this completed project.
Therefore:
Do not create a separate portfolio project called an "early fake-news model" and another called the M.Tech thesis.
Do not describe the GitHub implementation as unfinished.
Do not describe the thesis as a later extension of an incomplete project.
Do not use wording such as "prototype", "early-stage", "initial attempt", or "unfinished" for the overall project.
The word "preliminary" may appear only when accurately describing the preliminary ML/DL baseline component inside the completed dissertation, because that is the terminology used by the dissertation itself.
Treat the complete dissertation as the authoritative source for the project's full scope and research story.
Treat the GitHub repository as the source for implementation details and runnable code.
The final project page should communicate the entire completed system as one coherent body of work.
The completed project includes both the ML/DL baseline and the final transformer-driven framework. Its progression is part of the research methodology, not evidence that the project is incomplete.
The canonical relationship is:
Completed GitHub implementation + completed M.Tech dissertation = one complete portfolio project.
The project is a completed M.Tech dissertation project with documented methodology, experiments, verified results, external evaluation and conclusions.
1. PURPOSE OF THIS DOCUMENT
The portfolio should not present the user's projects as a flat list of
repository names with one-line descriptions. The objective is to
communicate the actual engineering work behind the projects.
A visitor should be able to understand, depending on how deeply they
explore:
what problem the project addresses;
what the project actually does;
what the user built;
how it works;
which technologies were used;
which important technical decisions were made;
what the architecture or processing pipeline looks like;
what the important features are;
what datasets or external services were involved;
what the measurable results were when results are available;
what limitations exist;
how the project evolved;
where the project can be viewed or tested when a real live/demo link
exists.
The portfolio must therefore treat projects as technical case
studies, while still keeping the first visual presentation concise.
The project content must be derived from the user's actual source
material:
GitHub repositories belonging to `vishavmehra`.
The user's M.Tech dissertation and related research material.
Existing portfolio/project material already provided by the user.
Existing live-demo information when an actual working URL is
available.
The following repositories should not be treated as portfolio
projects:
`personal-portfolio`
`vishavmehra` profile README
The age of a repository must not be used as a reason to exclude it.
Older repositories can still be included when they represent meaningful
work or demonstrate a relevant skill.
Do not invent technologies, metrics, architecture, features, ownership,
publications, links, or results.
---
2. CORE CONTENT PRINCIPLES
2.1 Accuracy over marketing
The portfolio should sound confident because the work itself is
technically substantial. It should not rely on exaggerated language.
Do not turn:
> "Used X"
into:
> "Revolutionized X using a cutting-edge architecture"
unless the source material genuinely supports that statement.
Do not claim:
production scale unless production deployment is documented;
real-time performance unless the implementation supports it;
AI capabilities that are not actually implemented;
original algorithms when a project is clearly tutorial-derived;
research publication status when there is only a thesis;
a live demo when no verified live demo exists;
a specific performance number unless it comes from the
project/research evidence.
Use precise engineering language.
---
2.2 Different projects need different levels of detail
A simple frontend project does not need the same technical treatment as
the M.Tech research project.
The portfolio should therefore naturally vary the depth:
Small projects
Explain:
what it does;
core functionality;
technology;
important implementation point.
Medium projects
Explain:
problem;
solution;
architecture;
major features;
technology;
notable implementation decisions.
Technical/AI projects
Explain:
problem;
data;
preprocessing;
modelling;
architecture;
training/evaluation;
results;
limitations;
important findings.
M.Tech thesis
Treat it as the deepest technical case study.
It should communicate:
research motivation;
preliminary baseline;
why the baseline was insufficient;
proposed transformer architecture;
ensemble strategies;
datasets;
evaluation protocol;
results;
cross-domain verification;
multilingual verification;
metadata/graph diagnostics;
limitations;
future work.
---
3. MASTER PROJECT INVENTORY
The meaningful GitHub projects identified for portfolio consideration
are:
TravelMe
listing
NexTalk
MediSense-Ai
ExpenseEase
TinDog
grammar-scoring-engine
ReelAlchemy
eye-controlled-wheelchair
authors
Retrogroove
Heart-Attack-Prediction-Analysis
Fake-news-detection-stacked-model-implementation
In addition, the portfolio must include:
Cross-Domain Fake News Detection Using Transformer-Driven Ensemble
Learning --- M.Tech dissertation/research project
`personal-portfolio` and the GitHub profile README are excluded from
this project inventory.
The inventory should remain evidence-driven. If source inspection later
establishes that a repository is only a trivial starter/template with no
meaningful original work, Claude may keep its portfolio presence minimal
or omit it rather than inventing substance.
---
4. PROJECT CONTENT STRUCTURE
Every meaningful project should conceptually have the following content
available:
Project identity
Project name
Short description
Category/context
Technology stack
The problem
Explain the practical or technical problem that motivated the project.
For a small project this may be one paragraph.
For a research project it can become a dedicated section.
The solution
Explain what the project actually provides.
Avoid vague statements such as "an advanced solution."
Describe the actual workflow.
Implementation
Explain how the project works internally.
This is where repository structure, architecture, algorithms, API usage,
database design, model pipeline, UI structure, or hardware integration
should be discussed.
Key features
List only features that actually exist.
Technical details
Include meaningful implementation details rather than repeating the
technology list.
For example:
authentication flow;
database model;
API integration;
model architecture;
preprocessing;
ensemble strategy;
inference flow;
computer-vision pipeline;
feature extraction;
serial communication;
state management.
Results
Include numerical results only when documented.
For ML projects, this can include:
accuracy;
precision;
recall;
F1;
RMSE;
Pearson correlation;
confusion-matrix observations;
cross-validation;
dataset-specific results.
Limitations
Mention meaningful limitations when they are part of the project's
technical story.
Links
Use only actual verified links that exist.
Do not manufacture URLs.
The existing portfolio data structure should be reused rather than
creating unnecessary new metadata categories.
---
5. PROJECT: TRAVELME
Overview
TravelMe is a travel-focused web interface built around a visually rich
landing-page experience.
The repository describes a Next.js, Tailwind CSS, and TypeScript
implementation with sections for:
hero content;
camp exploration;
travel guides;
feature-rich content;
mobile-app call-to-action;
footer.
The repository README indicates that this project follows material from
a JavaScript Mastery tutorial/template.
That provenance matters.
The portfolio must not present TravelMe as though every aspect of the
design and implementation was independently invented by the user if the
source material is tutorial-derived.
What to communicate
TravelMe can be presented as a frontend/web-development project
demonstrating the user's ability to work with:
Next.js;
TypeScript;
Tailwind CSS;
responsive layouts;
reusable UI sections;
image-driven visual design;
modern component-based frontend development.
Technical story
The important story is not merely "I made a travel website."
It is:
> Built a responsive travel experience using Next.js, TypeScript and
> Tailwind CSS, implementing a component-driven page structure with
> travel discovery, guide, feature and CTA sections.
If repository inspection identifies additional original modifications,
those may be described separately.
Accuracy constraint
Do not call TravelMe a completely original product without evidence.
---
6. PROJECT: LISTING
Overview
`listing` is a Next.js-based property/listing application.
The repository is more technically significant than its default README
suggests. The implementation uses a modern full-stack web architecture
around:
Next.js;
TypeScript;
Prisma;
PostgreSQL/database-backed data;
authentication;
listings/properties;
reservations;
trips;
favourites;
server/API functionality;
reusable hooks/providers/components.
Problem
The application models a property-booking experience in which users can
browse listings and interact with properties and reservations.
Solution
The project provides the structure of a modern booking platform rather
than a purely static landing page.
The important portfolio story is the transition from UI to full-stack
behaviour.
Architecture
The conceptual flow is:
User → Next.js UI → application/server actions or API layer → Prisma →
database
Authentication and application state sit across the user experience and
protected operations.
Important functionality
The content should cover, where confirmed by the implementation:
property/listing creation or management;
listing browsing;
property details;
reservations;
trip/reservation history;
favourite listings;
authentication;
database persistence;
reusable UI components;
server-side data access.
Technical value
This project demonstrates that the user can work beyond frontend styling
and integrate:
relational data;
ORM-based persistence;
authentication;
server-side logic;
user-specific state;
multi-step application workflows.
Do not claim a production booking platform, payment processing, or
production-scale infrastructure unless the repository actually contains
it.
---
7. PROJECT: NEXTALK
Overview
NexTalk should be represented based on the actual source code rather
than guessing from the repository name.
The content extraction process for Claude must inspect:
README;
package configuration;
application routes;
components;
backend/API logic;
database configuration if present;
authentication;
messaging or communication logic;
deployment information.
Required presentation
Once verified, explain:
what communication problem NexTalk solves;
what a user can actually do;
how the frontend and backend interact;
how messages/data are stored;
how authentication or user identity works if present;
important technologies;
the most technically meaningful implementation detail.
Do not invent functionality merely from the name "NexTalk."
If the repository proves that it is a chat/messaging system, describe
the actual communication architecture. If it contains additional
functionality, include it only after source verification.
---
8. PROJECT: MEDISENSE-AI
Overview
MediSense-Ai is one of the user's stronger AI/application projects.
The README describes a modular Llama-MD-style framework for building a
medical-domain LLM/RAG system focused on pregnancy and gynecology.
The system combines:
PDF ingestion;
topic modelling;
Wikipedia scraping;
text/data extraction;
embedding generation;
vector storage;
retrieval;
LLM inference;
Streamlit interface.
Pinecone is used for vector storage.
Problem
General-purpose language models may not have reliable domain-specific
context for specialized medical questions.
The project explores a domain-focused pipeline in which relevant medical
information can be collected, transformed into embeddings, stored,
retrieved and used in an LLM-powered interface.
Solution
The system builds a domain-specific retrieval and inference pipeline.
Conceptually:
Medical documents → extraction → preprocessing/topic modelling →
embeddings → Pinecone vector database → retrieval → LLM response →
Streamlit interface
Additional Wikipedia-derived information is incorporated into the
knowledge pipeline.
Components
PDF reader
The repository includes PDF-reading/data extraction components for
turning source documents into usable text.
Topic modelling
Topic modelling is used to identify thematic structure in the collected
material.
Wikipedia scraping
The project includes a Wikipedia data collection component to supplement
the domain information.
Embeddings
Text is transformed into vector representations for semantic retrieval.
Pinecone
The vectors are stored in a vector database to support similarity-based
retrieval.
RAG
The retrieval stage supplies relevant context before the model generates
an answer.
Streamlit
A Streamlit application exposes the system as an interactive interface.
Portfolio description
A strong concise description:
> Built a medical-domain LLM/RAG pipeline for pregnancy and gynecology,
> combining document ingestion, topic modelling, embeddings, Pinecone
> retrieval and a Streamlit interface.
The detailed project view should explain the pipeline rather than merely
listing "LLM, RAG, Pinecone."
Accuracy constraints
Do not call this a medical diagnostic system.
Do not claim clinical validation.
Do not claim that it provides medically reliable diagnoses.
Describe it as a technical domain-specific LLM/RAG application.
---
9. PROJECT: EXPENSEEASE
Overview
ExpenseEase is a React-based budget/expense tracker.
The project uses React Hooks and fetch-based interaction.
Problem
Users need a simple way to compare income/salary against expenses and
understand whether their remaining balance is positive or negative.
Solution
The application takes salary/net income and expenses and calculates the
resulting balance.
Technical focus
The portfolio should emphasize:
React;
component-based UI;
state management through Hooks;
user input;
calculations;
fetch/API interaction where implemented;
immediate financial-balance feedback.
This is a smaller project, so the content should remain concise.
Do not artificially turn it into a complex financial-management
platform.
---
10. PROJECT: TINDOG
Overview
TinDog should be included only to the degree supported by its actual
implementation.
The content extraction process should inspect the repository before
writing a detailed claim.
If it is primarily a frontend practice project, represent it as such.
Potential relevant dimensions include:
responsive UI;
landing-page design;
component/layout work;
Bootstrap or other confirmed styling technology.
Do not create functionality that is not in the source.
If it is clearly a tutorial/practice implementation, make that context
transparent rather than presenting it as an independently engineered
product.
---
11. PROJECT: GRAMMAR SCORING ENGINE
Overview
The Grammar Scoring Engine is an AI system for estimating
grammar/proficiency-related scores from spoken English audio.
This is a technically significant machine-learning project because it
combines deep speech representations with traditional acoustic/prosodic
features and a classical regression model.
Problem
Spoken-language evaluation cannot be reliably represented using only
transcript text.
The project therefore combines:
learned speech representations;
acoustic information;
prosodic information;
dimensionality reduction;
supervised regression.
Core architecture
The documented pipeline uses:
Audio → Wav2Vec 2.0 embeddings + acoustic/prosodic features → feature
combination → PCA → XGBoost → score prediction
Wav2Vec 2.0
The implementation uses `wav2vec2-base-960h`.
The model provides learned representations from speech audio.
This allows the system to capture information that traditional
hand-crafted acoustic features may miss.
Traditional features
The system also extracts acoustic/prosodic characteristics from the
audio.
The important architectural point is that the project does not depend
exclusively on the neural embedding.
It uses a hybrid feature architecture.
Dimensionality reduction
The combined feature representation contains approximately 776 features.
PCA reduces this representation to 50 dimensions.
This reduces the feature space before regression.
Regression
XGBoost is used as the regression model.
The documented configuration includes regularization-related settings
such as:
`subsample = 0.7`
`max_depth = 3`
These details are useful because they demonstrate that the final model
was not simply a default black-box call.
Evaluation
The project uses:
Pearson correlation;
RMSE;
5-fold cross-validation.
These metrics are appropriate for continuous score prediction.
Technologies
The documented stack includes:
Python 3.10+
PyTorch
Transformers
Librosa
SoundFile
XGBoost
Scikit-learn
Matplotlib
Seaborn
Portfolio presentation
Short:
> Built a hybrid speech-scoring pipeline combining Wav2Vec 2.0
> embeddings with acoustic and prosodic features, PCA-based
> dimensionality reduction and XGBoost regression.
Detailed:
Explain why combining learned speech embeddings with hand-crafted
acoustic information creates a hybrid representation, then explain the
PCA and regression stages.
Do not call it an automated language certification system unless such
certification functionality exists.
---
12. PROJECT: REELALCHEMY
Overview
ReelAlchemy is a movie-search web application.
The implementation uses React and the OMDb API.
Problem
Users need a simple interface for searching movies and exploring results
without manually navigating a large catalogue.
Solution
The application queries OMDb based on a movie name/keyword and presents
results through reusable movie cards.
Core flow
User enters search → request to OMDb API → response data → movie cards →
interaction/close functionality
Features
The portfolio can describe:
movie search;
OMDb API integration;
dynamic results;
reusable movie cards;
interaction controls;
frontend state handling.
Technical value
This is a useful example of integrating an external REST API into a
frontend application.
The project demonstrates:
asynchronous data fetching;
API response handling;
component rendering;
search-driven UI;
external-service integration.
Do not claim a proprietary movie database.
---
13. PROJECT: EYE-CONTROLLED WHEELCHAIR
Overview
Eye Controlled Wheelchair is a computer-vision and accessibility project
designed for hands-free wheelchair control.
This is one of the user's important engineering projects because it
combines:
computer vision;
facial landmarks;
eye movement detection;
machine learning;
GUI development;
training-data creation;
hardware communication.
Problem
Traditional wheelchair controls require physical hand operation.
The project explores an alternative interface based on eye/facial
movement so that users can issue directional commands without
conventional physical controls.
Core system
Camera → face detection → facial landmarks → eye/feature extraction →
trained classifier → directional command → serial communication →
wheelchair controller
User interface
The system includes a GUI.
The documented implementation provides functionality for:
starting/stopping the camera;
creating datasets;
training the model;
running detection;
sending commands.
Commands
The documented system supports five commands:
left;
right;
up;
down;
stop.
Computer vision
The project uses:
OpenCV;
Dlib;
Imutils;
scikit-image.
Dlib facial landmarks are used as part of the facial/eye analysis.
The earlier project description also references face detection and
facial landmark processing.
Machine learning
The system includes a training mode so that data can be created and a
classifier can be trained for the required commands.
The known project stack includes scikit-learn.
Do not invent a classifier name unless the source code confirms it.
Hardware integration
The system communicates through a serial port.
The software translates detected eye/facial commands into control
messages for the wheelchair hardware.
This is important because it makes the project more than an
image-classification demo: the inference result is connected to a
physical control interface.
Technologies
Python
OpenCV
PyQt5
Dlib
Imutils
scikit-image
scikit-learn
Winsound
PyWin32
serial communication
Only retain dependencies confirmed by the source.
Portfolio presentation
Short:
> Built a hands-free wheelchair control system using facial landmarks
> and eye-movement detection, with a training pipeline, desktop
> interface and serial hardware control.
Detailed view:
Explain the full pipeline from camera input to command transmission.
Accuracy constraint
Do not claim that the system is clinically certified or production-ready
medical equipment.
Describe it as an accessibility-oriented prototype/system.
---
14. PROJECT: AUTHORS
Overview
`authors` should be inspected before receiving detailed portfolio
treatment.
The repository README is based on the default Next.js starter material.
If source inspection shows that it contains meaningful custom work,
document that work.
If it remains primarily a starter/practice project, do not manufacture a
complex story.
The portfolio should prioritize meaningful technical work over filling
space.
---
15. PROJECT: RETROGROOVE
Overview
RetroGroove is a music-platform project using a modern full-stack web
stack.
The known implementation includes:
Next.js;
TypeScript;
Supabase;
authentication/middleware;
music/song components;
upload functionality;
song modal;
database types;
reusable UI components.
Problem
A music application needs more than a static list of songs.
It requires:
user identity;
persistent data;
music/content management;
interactive UI;
upload flows;
authenticated operations.
Solution
RetroGroove is structured as a full-stack music experience.
The application combines a modern Next.js interface with Supabase-backed
functionality.
Architecture
Conceptually:
User → Next.js application → authentication/middleware → application
components → Supabase → persistent music/application data
Important features
Where confirmed by source:
user authentication;
music/song browsing;
song display;
upload flow;
song modal;
reusable UI components;
database integration.
Technical value
RetroGroove demonstrates the user's ability to combine:
modern React/Next.js;
TypeScript;
backend-as-a-service;
authentication;
database persistence;
interactive application state.
Portfolio description
> Built a full-stack music platform with Next.js, TypeScript and
> Supabase, including authentication, song management, uploads and
> reusable music-focused UI components.
Do not claim streaming infrastructure, audio licensing, recommendation
algorithms, or production-scale delivery unless the repository contains
those systems.
---
16. PROJECT: HEART-ATTACK-PREDICTION-ANALYSIS
Overview
This project is a machine-learning/data-analysis study using anonymized
patient data.
The documented workflow uses PyCaret and a range of classical
machine-learning models.
Problem
The goal is to analyse patient attributes and build predictive models
for heart-attack-related outcomes.
The project is also focused on exploratory data analysis and model
comparison.
Data preparation
The documented workflow includes:
handling missing values;
outlier handling;
preprocessing;
scaling;
exploratory analysis.
Exploratory data analysis
The project includes:
histograms;
boxplots;
correlation heatmaps;
pair plots.
This should be presented as part of the modelling workflow, not as
decorative charting.
Models
The documented comparison includes:
Logistic Regression;
Decision Tree;
Random Forest;
KNN;
Gradient Boosting.
PyCaret is used to facilitate the machine-learning workflow and
comparison.
Evaluation
The project includes:
confusion matrices;
ROC curves;
feature importance;
comparative model analysis.
Portfolio presentation
> Analysed anonymized patient data and compared multiple
> machine-learning models using PyCaret, with preprocessing, exploratory
> analysis, ROC evaluation, confusion matrices and feature-importance
> analysis.
Safety/accuracy constraint
Do not describe this as a clinical diagnostic tool.
Do not imply that the model can medically diagnose an individual.
Present it as a machine-learning analysis/project.
---
17. PROJECT: FAKE NEWS DETECTION --- STACKED MODEL IMPLEMENTATION
Overview
This project is the important preliminary stage of the later M.Tech
research.
It should not be treated as an unrelated project.
It represents the initial ML/DL exploration that eventually motivated
the transformer-driven thesis.
Problem
Fake-news detection can be approached using textual features and
machine-learning/deep-learning models.
The project investigates whether multiple models can be combined into a
stacked ensemble.
Dataset
The repository uses the ISOT Fake News Dataset and also includes LIAR
experiments.
Preprocessing
The documented preprocessing includes:
lowercasing;
punctuation removal;
number/special-character handling;
NLTK stopword removal;
normalization;
spaCy lemmatization.
Classical ML models
The implementation includes:
SVM;
Logistic Regression;
Decision Tree;
KNN;
Random Forest using TF-IDF;
Random Forest using CountVectorizer.
Deep learning models
The implementation includes:
Uni-LSTM;
Bi-LSTM;
Uni-GRU;
Bi-GRU;
CNN.
Tokenisation
The deep-learning pipeline uses a Keras tokenizer.
The documented maximum sequence length is 300.
The embedding dimension is 128.
Training uses Adam and binary crossentropy, with early stopping.
Stacked ensemble
The ensemble combines predictions from multiple base learners.
The documented meta-classifier is a Random Forest with:
`n_estimators = 300`
`max_depth = 40`
`random_state = 42`
The important concept is that predictions from the different base models
become inputs to a meta-classifier.
ISOT result
The project/thesis documents approximately 99.85% accuracy for the
stacked ISOT implementation.
This number must be presented as the result for the specific
experimental setup, not as a universal fake-news-detection accuracy.
LIAR result
The earlier implementation reached approximately:
71.03% accuracy for binary LIAR classification;
30.28% accuracy for six-class LIAR classification.
The difference between ISOT and LIAR became a major research finding.
Why the difference matters
ISOT contains full-length articles and offers many lexical/style
signals.
LIAR contains short political claims.
A short claim often lacks the context needed for reliable truthfulness
classification.
Therefore, a system can perform extremely well on one dataset while
transferring poorly to another.
This observation directly motivated the next stage: transformer-based
contextual modelling.
---
18. M.TECH PROJECT --- CROSS-DOMAIN FAKE NEWS DETECTION USING TRANSFORMER-DRIVEN ENSEMBLE LEARNING
Status
This is the user's M.Tech dissertation and should be treated as a major
research project.
Title:
Cross-Domain Fake News Detection Using Transformer-Driven Ensemble
Learning
The dissertation was conducted during 2025--2026 as part of the M.Tech
program in Computer Science and Engineering with specialization in
Information Security and Privacy at SVNIT, Surat.
The thesis itself declares the work as the user's own work.
Why it deserves deeper treatment
This is not simply another machine-learning notebook.
It is the evolution of the earlier fake-news project into a broader
research framework addressing:
clean article-level classification;
noisy short-claim classification;
binary classification;
six-class truthfulness classification;
transformer-based contextual modelling;
ensemble learning;
domain shift;
multilingual verification;
metadata/graph diagnostics;
defensible evaluation.
---
19. RESEARCH MOTIVATION
The central problem is not simply:
> "Can a model classify fake news?"
The research asks whether a detection framework can remain useful when
the data changes in:
text length;
noise;
domain;
label granularity;
language.
The thesis identifies three central sub-problems.
19.1 Clean articles vs short claims
ISOT provides full-length real/fake articles.
LIAR provides short political claims.
A model that succeeds on full articles may rely on lexical or stylistic
signals that do not transfer to short claims.
19.2 Binary vs six-class truthfulness
Binary fake/real classification is easier than distinguishing six
neighbouring truthfulness categories.
LIAR contains:
pants-fire;
false;
barely-true;
half-true;
mostly-true;
true.
These labels are semantically close in places, making multi-class
classification difficult.
19.3 Domain shift
A model trained on one dataset may not generalize to another.
Therefore, the thesis evaluates external datasets:
Politifact;
GossipCop;
PolyglotFakeFacts.
These represent different domains and/or language settings.
---
20. OBJECTIVES
The thesis objectives include:
comparing classical ML, deep learning and transformer approaches;
improving LIAR binary and multi-class classification;
evaluating multiple ensemble strategies;
testing threshold tuning;
testing validation-weighted fusion;
testing stacked meta-classification;
evaluating hierarchical classification;
testing metadata/graph modelling in a controlled way;
performing external verification;
reporting metrics and diagnostics in a defensible manner.
---
21. CONTRIBUTION OF THE PRELIMINARY WORK
The transformer research did not start from zero.
The preliminary ML/DL stacked implementation established the initial
baseline.
The research progression is:
Classical ML + DL
→ strong ISOT performance
→ poor transfer to LIAR
→ identify contextual limitation
→ introduce transformers
→ compare ensemble strategies
→ tune decisions using validation data
→ test cross-domain datasets
→ investigate metadata/graph signals separately
This progression is an important part of the project's story.
It demonstrates iterative engineering and research rather than simply
trying one model.
---
22. PROPOSED ARCHITECTURE
The thesis describes a framework containing several branches.
High-level flow:
Input dataset → preprocessing/text building → TF-IDF baseline →
transformer branch → optional metadata branch → prediction/probability
storage → ensemble layer → evaluation
Transformer branch
The main contextual models are:
DistilBERT;
BERT;
RoBERTa.
Each provides a contextual representation and predictions.
TF-IDF branch
TF-IDF provides a fast lexical baseline.
The documented representation includes word and character n-grams.
This is important because the research does not assume that a
transformer is automatically superior on every dataset.
Metadata branch
Metadata/graph information is explored separately.
This branch is particularly important for understanding leakage and
dataset-specific signals.
Ensemble layer
The system compares several fusion strategies rather than treating one
model as the final answer.
---
23. DATASETS
ISOT
Role:
preliminary clean article-level binary benchmark.
Text type:
full news articles.
Labels:
fake/real.
Purpose:
establish a strong initial ML/DL baseline.
LIAR
Role:
primary transformer benchmark.
Text type:
short political claims.
Settings:
binary;
six-class.
Purpose:
test contextual understanding and fine-grained truthfulness
classification.
For binary classification, the thesis maps:
Fake: - pants-fire; - false; - barely-true.
Real: - half-true; - mostly-true; - true.
The six-class setting keeps all six labels.
Politifact
Role:
external political-domain verification.
Setting:
binary fake/real.
GossipCop
Role:
external domain-shift verification.
Domain:
entertainment/celebrity news.
PolyglotFakeFacts
Role:
multilingual/translated misinformation verification.
Purpose:
test robustness beyond the main LIAR setting.
---
24. ENSEMBLE STRATEGIES
The thesis compares multiple ensemble mechanisms.
Majority voting
Each base model contributes a class prediction.
The final class is determined from the combined votes.
Probability averaging
Instead of discarding confidence information, model probabilities are
averaged.
This allows the ensemble to use the distribution of confidence across
models.
Validation-weighted averaging
Different models receive weights based on validation behaviour.
The key methodological point is that weights are determined using
validation data rather than the final test set.
Threshold tuning
For binary classification, the decision threshold can be adjusted.
The threshold is tuned using validation data.
The final test set remains unseen during tuning.
Stacked meta-classification
Base model predictions become features for a meta-classifier.
This extends the original stacked-ensemble idea from the preliminary
project.
Hierarchical classification
The research also examines hierarchical binary→six-class classification.
This separates a broad real/fake decision from the more difficult
fine-grained truthfulness labels.
Metadata/graph modelling
Metadata and graph-style signals are explored as an additional branch.
The thesis deliberately separates diagnostic metadata results from
primary content-based results because metadata can leak source/domain
information.
---
25. EVALUATION PROTOCOL
A major strength of the research methodology is the separation of
training, validation and testing.
The documented protocol is:
create train/validation/test split;
train base models on training data;
generate validation probabilities;
tune threshold or ensemble weights using validation data;
generate test probabilities;
report final test metrics and confusion matrices.
This prevents the test set from becoming a tuning set.
The thesis also documents fixed random seeds where possible and saves
result CSVs and confusion matrices for reproducibility/reporting.
---
26. METRICS
For binary tasks, the project reports:
accuracy;
precision;
recall;
F1-score.
For multi-class LIAR, macro-averaged precision, recall and F1 are
important because each truthfulness class should contribute equally
rather than allowing the majority class to dominate the metric.
Confusion matrices are also used to identify:
false positives;
false negatives;
class confusion;
degenerate predictions.
---
27. RESULTS --- PRELIMINARY BASELINE
ISOT
The preliminary stacked ML/DL implementation achieved approximately:
99.85% accuracy
This should be described as near-perfect performance on the specific
ISOT experimental setup.
It should not be generalized to all fake-news datasets.
LIAR binary
The earlier baseline achieved approximately:
71.03% accuracy
LIAR six-class
The earlier stacked baseline achieved:
30.28% accuracy
This contrast was a major motivation for the transformer stage.
---
28. RESULTS --- FINAL LIAR TRANSFORMER WORK
The strongest verified LIAR binary result is:
Accuracy: 80.42%
Precision: 80.11%
Recall: 79.92%
F1-score: 80.01%
The improvement should be presented relative to the earlier
approximately 71.03% LIAR binary baseline.
For six-class LIAR:
main transformer output: 44.82% accuracy
strongest verified result: 45.91% accuracy
macro recall: 48.74%
The project should not hide the difficulty of the six-class task.
The research is stronger when it explains the remaining difficulty
instead of presenting one number without context.
---
29. EXTERNAL VERIFICATION
The primary non-diagnostic external results are:
Politifact
Accuracy:
91.95%
Primary method:
TF-IDF baseline.
GossipCop
Accuracy:
87.62%
Primary method:
tuned-accuracy-threshold ensemble.
PolyglotFakeFacts
Accuracy:
99.61%
Primary method:
TF-IDF baseline.
These results should be described as external verification results from
the documented experimental setup.
Do not claim that the system universally achieves these numbers on all
Politifact, GossipCop or multilingual data.
---
30. METADATA LEAKAGE --- IMPORTANT
This must be handled carefully in the portfolio.
Some metadata-only or metadata-stacked experiments produced very high
scores.
However, the thesis explicitly treats those results as diagnostic rather
than primary performance because metadata such as:
source;
publisher;
folder;
domain;
can leak label information.
Therefore:
Do not use metadata-only near-perfect results as the headline project
accuracy.
The defensible project story is based on the primary non-diagnostic
methods.
This is an important research-quality detail and should be retained in
the deeper project view.
---
31. WHAT THE RESEARCH ACTUALLY SHOWS
The research demonstrates several findings.
Finding 1
Strong performance on clean article-level datasets does not guarantee
strong performance on short claims.
Finding 2
The LIAR dataset exposes weaknesses in shallow/recurrent modelling.
Finding 3
Transformer contextual representations improve the LIAR results over the
earlier ML/DL baseline.
Finding 4
Ensemble strategies can combine complementary model behaviour.
Finding 5
Six-class truthfulness classification remains substantially harder than
binary classification.
Finding 6
External verification is useful for testing domain shift.
Finding 7
Metadata can produce misleadingly high results when it contains
dataset/source leakage.
Finding 8
Evidence-aware fact verification remains a future direction because the
current project is primarily text-based classification.
---
32. LIMITATIONS OF THE THESIS
The project is primarily a text-based fake-news detection framework.
It does not perform:
live web evidence retrieval;
stance verification against trusted knowledge bases;
claim-level fact checking using retrieved documents.
This distinction is important.
The project classifies content based on learned textual patterns and
controlled metadata experiments.
It should not be described as a complete automated fact-checking engine.
---
33. FUTURE WORK
The thesis identifies several future directions.
Evidence retrieval
A retrieval system could collect:
supporting articles;
fact-check pages;
trusted knowledge snippets.
The model could then compare a claim against external evidence.
LIAR-PLUS-style justification data
Fact-checker justifications could provide context absent from short
claims.
Larger transformer models
Potential future models include:
DeBERTa;
ELECTRA;
long-context encoders.
Parameter-efficient fine-tuning
Adapters or LoRA could reduce compute requirements.
Calibration
Probability calibration could make confidence values more reliable.
Explainability
Potential techniques include:
attention visualisation;
SHAP;
error clustering.
The portfolio may mention these as future work, not as implemented
features.
---
34. PROJECT EVOLUTION STORY
The fake-news work should be represented as one complete, full-fledged project. The M.Tech dissertation is its comprehensive technical document and the GitHub repository is its implementation.
The progression inside the completed project is:
Stage 1 --- Classical/DL exploration
Build models using:
SVM;
Logistic Regression;
Decision Tree;
KNN;
Random Forest;
CNN;
LSTM;
GRU.
Stage 2 --- Stacking
Combine base-model predictions through a meta-classifier.
Stage 3 --- Dataset comparison
Evaluate on ISOT and LIAR.
Stage 4 --- Identify the limitation
ISOT performs extremely well while LIAR performance drops.
Stage 5 --- Transformer research
Introduce:
DistilBERT;
BERT;
RoBERTa.
Stage 6 --- Better ensemble design
Explore:
voting;
probability averaging;
validation weighting;
threshold tuning;
stacking.
Stage 7 --- Broader evaluation
Test:
Politifact;
GossipCop;
PolyglotFakeFacts.
Stage 8 --- Diagnostics
Study metadata and graph signals while keeping leakage-sensitive results
separate.
This progression is one of the strongest stories available for the
portfolio.
---
35. LIVE DEMOS
Live demonstrations should be integrated only where a real URL exists.
Do not create placeholder links.
Do not write:
> Live Demo
if no actual demo is available.
Where an actual live demo is known, the existing portfolio can expose it
naturally.
The project documentation should not force every project to have a demo.
For repositories without a deployed application, GitHub/source access is
sufficient if that is the available verified destination.
---
36. OWNERSHIP AND AUTHorship
Projects should be represented according to the user's actual
contribution.
The user has stated that one of the projects was implemented by them
even though it was later submitted by a friend as that friend's thesis.
For portfolio purposes, if the user's implementation ownership is the
intended representation, the project should be presented as work the
user implemented.
Do not describe it as a collaboration unless the source evidence
requires that description.
Do not add accusations or commentary about another person's submission.
The portfolio should simply describe the user's technical contribution
accurately.
The M.Tech dissertation itself declares the work as the user's own work.
---
37. TECHNOLOGY PRESENTATION
Technology lists should not become meaningless keyword walls.
Bad:
> React, Next.js, TypeScript, CSS, HTML, JavaScript, Node, GitHub, API,
> Database, AI...
Better:
> **Stack:** Next.js, TypeScript, Tailwind CSS\
> **Core work:** responsive component architecture, API integration and
> dynamic content rendering.
For technical projects:
> **Stack:** Python, PyTorch, Transformers, XGBoost, Scikit-learn\
> **Core work:** hybrid feature extraction, contextual transformer
> fine-tuning and ensemble evaluation.
The deeper view can explain each technology's role.
---
38. HOW PROJECT DESCRIPTIONS SHOULD BE WRITTEN
Each project should have multiple levels of communication.
Level 1 --- Card
One or two sentences.
It must immediately tell the visitor what the project is.
Level 2 --- Expanded summary
A short explanation of:
problem;
solution;
technology.
Level 3 --- Technical details
Explain:
architecture;
implementation;
important components;
data flow.
Level 4 --- Deep technical case study
Reserved for projects where the implementation deserves it, especially:
M.Tech fake-news research;
eye-controlled wheelchair;
grammar scoring engine;
MediSense-Ai;
significant full-stack applications.
The UI should decide how these levels are displayed based on the
existing design. Do not redesign the portfolio merely to accommodate the
content.
---
39. DO NOT CHANGE THE EXISTING 3D/WORLD DESIGN FOR CONTENT
The project-content work must fit into the existing portfolio
experience.
Do not:
redesign the world;
change the navigation concept;
replace the existing visual language;
add unnecessary pages;
introduce a conventional dashboard;
add excessive project-card UI;
create a second portfolio architecture.
The content should be integrated into the existing design.
The goal is to make the existing world communicate more complete project
information, not to turn it into a conventional documentation website.
---
40. PROJECT SELECTION AND PRIORITY
Not every project requires equal visual emphasis.
The content system should preserve all meaningful project information
while allowing the strongest technical work to naturally receive more
depth.
The strongest technical case-study candidates include:
Cross-Domain Fake News Detection;
Fake News Detection Stacked Model;
Eye Controlled Wheelchair;
Grammar Scoring Engine;
MediSense-Ai;
Retrogroove;
listing.
Smaller projects can remain concise:
ExpenseEase;
ReelAlchemy;
TravelMe;
TinDog;
authors, if source inspection shows limited scope.
This is not a ranking of the user's projects. It is a content-depth
decision based on how much technical material is actually available.
---
41. PROJECT CONTENT EXTRACTION WORKFLOW FOR CLAUDE
Claude must work in this order.
Step 1 --- Inventory
Read the repositories and identify the meaningful projects.
Exclude:
`personal-portfolio`;
profile README.
Do not exclude older repositories simply because they are old.
Step 2 --- Repository inspection
For every candidate project inspect:
README;
package files;
source directories;
routes;
components;
configuration;
database/schema files;
model files;
notebooks;
data-processing scripts;
deployment configuration.
Step 3 --- Identify evidence
For every claim, identify where it came from.
Possible evidence:
README;
source code;
configuration;
notebook;
thesis;
existing demo.
Step 4 --- Build project understanding
Determine:
problem;
solution;
workflow;
architecture;
technologies;
important implementation;
results;
limitations.
Step 5 --- Cross-reference the thesis
For fake-news work, compare the GitHub implementation with the thesis.
The thesis is the authoritative source for the research narrative and
verified experimental results.
Step 6 --- Separate implemented work from future work
Do not describe future work as an implemented feature.
Step 7 --- Separate measured results from qualitative claims
Numbers need evidence.
Step 8 --- Write content
Generate:
short description;
detailed description;
technical explanation;
feature list;
result information where relevant.
Step 9 --- Integrate into existing content files
Keep project content separate from the 3D/world/core UI implementation
wherever the current architecture already supports data-driven content.
---
42. SOURCE-OF-TRUTH RULES
When sources disagree, do not silently invent a reconciliation.
Use the strongest direct evidence.
For research:
Thesis/report + experimental outputs
should take precedence over a generic README statement.
For implementation:
Actual repository source
should take precedence over a vague README.
For live links:
Verified current link
should be used.
For claims about ownership:
Use the user's stated ownership together with available project
evidence.
If something cannot be verified, omit the specific claim rather than
guessing.
---
43. WHAT CLAUDE MUST NOT DO
Claude must not:
invent technologies;
invent metrics;
invent live URLs;
invent publications;
claim production deployment without evidence;
claim medical validation;
claim clinical deployment;
call the fake-news system a complete fact-checking engine;
use metadata-leakage scores as primary results;
convert future work into implemented features;
call tutorial-derived work fully original without qualification;
remove older projects merely because they are old;
create unnecessary data-model fields;
create unnecessary documentation-link fields;
add demo-video fields merely because videos might exist;
add thesis/research-paper/other-link fields merely for the sake of
metadata;
alter the portfolio's visual architecture simply to display project
content;
flatten the thesis into a two-line project card;
reduce all projects to identical descriptions;
use generic AI buzzwords in place of technical explanation.
---
44. HOW TO HANDLE NUMERICAL RESULTS
Every numerical result must have context.
Bad:
> 99.85% accuracy.
Better:
> The preliminary stacked ML/DL implementation reached approximately
> 99.85% accuracy on the ISOT benchmark.
For the thesis:
> The strongest verified LIAR binary result reached 80.42% accuracy,
> with 80.11% precision, 79.92% recall and 80.01% F1.
Then explain that this improved on the earlier approximately 71.03% LIAR
binary baseline.
Do not claim:
> 99.85% accurate fake-news detector.
That would imply a universal performance claim that the research does
not support.
---
45. HOW TO PRESENT THE THESIS RESULTS
The preferred narrative is:
> The initial ML/DL stacked system performed extremely well on ISOT but
> transferred poorly to LIAR. This motivated a transformer-based
> ensemble framework using DistilBERT, BERT and RoBERTa. The final
> verified LIAR binary result reached 80.42% accuracy, while the
> strongest verified six-class result reached 45.91%. The framework was
> additionally evaluated on Politifact, GossipCop and PolyglotFakeFacts
> to study cross-domain and multilingual behaviour.
Then show deeper details when the user opens the project.
This is much stronger than simply saying:
> AI fake news detection with 99.85% accuracy.
---
46. HOW TO PRESENT THE EYE-CONTROLLED WHEELCHAIR
The portfolio should communicate the full engineering chain:
> Camera input → facial landmark detection → eye/facial feature
> extraction → trained command classifier → directional command → serial
> communication → wheelchair control.
This makes the project's value immediately understandable.
The project should be presented as an accessibility-oriented
computer-vision/hardware system.
The five commands should be visible in the detailed view:
Left
Right
Up
Down
Stop
The GUI/training pipeline should also be mentioned.
---
47. HOW TO PRESENT THE GRAMMAR ENGINE
The portfolio should communicate the hybrid architecture
visually/textually:
> Audio → Wav2Vec 2.0 representation\
> + acoustic/prosodic features\
> → \~776-dimensional combined representation\
> → PCA to 50 dimensions\
> → XGBoost regression\
> → score
This is much more informative than a technology list.
Mention:
Wav2Vec 2.0;
acoustic/prosodic features;
PCA;
XGBoost;
Pearson correlation;
RMSE;
5-fold cross-validation.
---
48. HOW TO PRESENT MEDISENSE-AI
The key visual/technical pipeline should be:
> Documents / Wikipedia\
> → extraction\
> → topic modelling\
> → embeddings\
> → Pinecone\
> → retrieval\
> → LLM inference\
> → Streamlit interface
This communicates the RAG architecture clearly.
Do not call it a general medical diagnosis product.
---
49. HOW TO PRESENT RETROGROOVE
The project story should focus on full-stack application engineering.
Use:
> Next.js + TypeScript + Supabase
Then explain:
authentication;
music data;
uploads;
song UI;
reusable components;
persistent backend state.
Do not overload the description with every UI component.
---
50. HOW TO PRESENT LISTING
Focus on:
> modern full-stack property-booking architecture.
Explain:
Next.js;
Prisma;
database;
authentication;
listings;
reservations;
trips;
favourites.
The important story is persistent user-driven application state rather
than visual design alone.
---
51. HOW TO PRESENT SMALL PROJECTS
Small projects should not receive artificial complexity.
ExpenseEase
Focus on:
React;
Hooks;
expense/income input;
balance calculation.
ReelAlchemy
Focus on:
React;
OMDb API;
movie search;
dynamic cards.
TravelMe
Focus on:
Next.js;
TypeScript;
Tailwind;
responsive travel UI;
tutorial/template provenance where appropriate.
TinDog
Focus only on verified frontend/practice work.
Authors
Focus only on verified custom implementation.
---
52. CONTENT TONE
The writing should sound like an engineer explaining work.
Preferred language:
built;
implemented;
designed;
integrated;
trained;
evaluated;
compared;
validated;
extracted;
fine-tuned;
combined;
deployed, only when deployment is real;
tested.
Avoid:
revolutionary;
groundbreaking;
next-generation;
game-changing;
cutting-edge, unless genuinely relevant and not used as empty
marketing;
world-class;
unbeatable;
perfect.
Technical credibility should come from details.
---
53. WHAT MAKES THE PORTFOLIO CONTENT STRONG
The strongest project content answers four questions quickly:
What did you build?
Concrete product/system.
Why did you build it?
Problem or motivation.
How does it work?
Architecture and implementation.
What did you learn or achieve?
Results, engineering outcomes, or research findings.
For the major projects, add:
What was difficult?
Describe the technical challenge.
What changed during development?
Describe iteration/evolution.
What are the limitations?
Be honest.
This is especially useful for the fake-news research.
---
54. FINAL CONTENT FORMAT FOR CLAUDE
Claude should produce project content conceptually in this shape:
``` text
PROJECT

Title
Short description

Overview
What the project is and why it exists.

Problem
The problem being addressed.

Solution
How the implementation addresses it.

How It Works
The architecture/data flow.

Key Features
- ...
- ...
- ...

Technical Implementation
Detailed implementation information.

Technology
Only meaningful technologies.

Results
Only verified results.

Limitations
Only meaningful limitations.

Live Demo / GitHub
Only actual existing links.
```
Not every project needs every section visibly.
The content source can contain deeper information while the UI chooses
what to expose.
---
55. DEEP CASE STUDY FORMAT FOR THE M.TECH PROJECT
The thesis should support a much deeper presentation:
``` text
Cross-Domain Fake News Detection Using Transformer-Driven Ensemble Learning

Overview

Research Problem

Why ISOT and LIAR Behave Differently

Preliminary ML/DL Pipeline

Classical Models

Deep Learning Models

Stacked Ensemble

Preliminary Results

Research Motivation

Proposed Transformer Architecture

DistilBERT

BERT

RoBERTa

TF-IDF Baseline

Ensemble Strategies

Threshold Tuning

Validation-Weighted Fusion

Stacked Meta-Classification

Hierarchical Classification

Metadata/Graph Diagnostics

Evaluation Protocol

LIAR Binary Results

LIAR Six-Class Results

External Verification

Politifact

GossipCop

PolyglotFakeFacts

Limitations

Future Work
```
This should be the deepest project content in the portfolio.
---
56. FINAL PROJECT CONTENT CHECKLIST
Before Claude considers the content complete, verify:
Inventory
[ ] all meaningful repositories inspected;
[ ] personal portfolio excluded;
[ ] profile README excluded;
[ ] old projects not automatically excluded;
[ ] M.Tech thesis included.
Technical accuracy
[ ] technologies verified;
[ ] architecture verified;
[ ] features verified;
[ ] datasets verified;
[ ] model names verified;
[ ] results verified.
Research accuracy
[ ] ISOT baseline included;
[ ] LIAR baseline included;
[ ] transformer stage included;
[ ] DistilBERT/BERT/RoBERTa included;
[ ] ensemble methods included;
[ ] validation-based tuning explained;
[ ] six-class difficulty explained;
[ ] external datasets included;
[ ] metadata leakage clearly separated;
[ ] limitations included;
[ ] future work separated from implementation.
Portfolio accuracy
[ ] no invented links;
[ ] no invented demos;
[ ] no invented publications;
[ ] no invented metrics;
[ ] no unnecessary metadata;
[ ] no unnecessary fields;
[ ] no redesign of the existing world/UI merely for content.
---
57. MASTER PROJECT LIST --- CONTENT SUMMARY
TravelMe
Travel-oriented responsive frontend built with Next.js, TypeScript and
Tailwind CSS. Tutorial-derived context must be represented accurately.
listing
Full-stack property/listing application using Next.js, Prisma and
database-backed application logic, including listings, reservations,
trips, favourites and authentication-related functionality where
confirmed.
NexTalk
Inspect and document the actual communication/application architecture
from source. Do not infer functionality from the name.
MediSense-Ai
Medical-domain LLM/RAG pipeline involving document ingestion, topic
modelling, Wikipedia data, embeddings, Pinecone retrieval and Streamlit.
ExpenseEase
React budget/expense tracker using Hooks, user input and balance
calculation.
TinDog
Frontend/practice project. Document only verified custom work.
grammar-scoring-engine
Hybrid spoken-English scoring system combining Wav2Vec 2.0 embeddings,
acoustic/prosodic features, PCA and XGBoost regression, evaluated using
Pearson correlation, RMSE and 5-fold cross-validation.
ReelAlchemy
React movie search application using the OMDb API and dynamic movie-card
rendering.
eye-controlled-wheelchair
Computer-vision accessibility system using facial landmarks/eye movement
detection, training, GUI interaction and serial wheelchair control for
five commands.
authors
Inspect before detailed presentation; avoid inventing substance.
Retrogroove
Full-stack music platform using Next.js, TypeScript and Supabase with
authentication, music/song functionality, uploads and reusable UI.
Heart-Attack-Prediction-Analysis
Machine-learning analysis using anonymized patient data, preprocessing,
EDA, PyCaret and multiple classical models with
confusion-matrix/ROC/feature-importance analysis.
Fake-news-detection-stacked-model-implementation
Preliminary fake-news research using ISOT and LIAR, classical ML,
CNN/LSTM/GRU models and a Random Forest stacking layer. Approx. 99.85%
ISOT accuracy, 71.03% LIAR binary accuracy and 30.28% LIAR six-class
accuracy in the documented baseline.
Cross-Domain Fake News Detection Using Transformer-Driven Ensemble Learning
M.Tech research project extending the preliminary fake-news work through
DistilBERT/BERT/RoBERTa, ensemble fusion, threshold tuning,
validation-weighted strategies, stacked classification, hierarchical
classification, external verification and controlled metadata
diagnostics. Final verified LIAR binary result: 80.42% accuracy, 80.11%
precision, 79.92% recall, 80.01% F1. Best verified LIAR six-class
result: 45.91% accuracy and 48.74% macro recall. External primary
results: Politifact 91.95%, GossipCop 87.62%, PolyglotFakeFacts 99.61%.
---
58. FINAL INSTRUCTION TO CLAUDE
Use this document as the content specification, not as a reason to
create unnecessary application infrastructure.
The objective is to make the user's existing portfolio communicate the
real depth of their work.
Read the actual repositories and research source material before
finalizing claims.
Where source material provides more detail than this document,
incorporate that detail.
Where this document provides a project direction but the source code
does not support a claim, prefer the source and omit unsupported
wording.
Do not fabricate.
Do not flatten the major projects.
Do not overcomplicate the small projects.
Do not add unnecessary portfolio fields.
Do not change the existing visual/world concept merely to accommodate
content.
The final result should feel like a technically strong engineer's
portfolio: concise at first glance, but capable of revealing substantial
engineering depth when a visitor explores a project.
The most important narrative to preserve is the user's progression:
frontend/full-stack development → computer vision → machine learning →
deep learning → LLM/RAG → fake-news ensemble learning →
transformer-based cross-domain research.
The portfolio should communicate that progression naturally through the
projects themselves rather than explicitly forcing a career-story
section into the interface.
59. PROJECT-BY-PROJECT DEPTH GUIDELINES
Claude should not force every project into the same amount of text. The
purpose of the content system is to preserve depth without making the
portfolio feel like a collection of README files.
59.1 TravelMe depth
Target content:
1 concise overview;
1 problem/experience statement;
1 implementation paragraph;
technology list;
3--5 verified features.
Do not spend several paragraphs describing ordinary landing-page
sections.
The interesting part is the frontend implementation and responsive
experience. Because the repository is associated with tutorial material,
provenance is more important than inventing technical complexity.
59.2 listing depth
Target content:
overview;
application workflow;
authentication;
listings;
reservation/trip flow;
database/Prisma architecture;
important reusable components;
technology stack.
The detailed view should explain how a user action travels through the
application rather than listing framework names.
59.3 NexTalk depth
NexTalk requires source inspection before final writing.
The extraction process should answer:
Is it a chat application?
Is there real-time communication?
What transport is used?
Is there authentication?
Is there persistence?
What backend is used?
How are users/conversations represented?
Is there media/file sharing?
Is there a notification mechanism?
Only answers supported by source code should enter the final portfolio.
59.4 MediSense-Ai depth
This should receive a substantial technical explanation.
Explain the distinction between:
collecting information;
processing information;
embedding information;
storing vectors;
retrieving relevant context;
generating a response.
This demonstrates that the project is a pipeline rather than simply "an
LLM chatbot."
Where source code exposes separate modules, preserve that modular
structure in the explanation.
The project should also clearly identify the medical domain as pregnancy
and gynecology.
Avoid implying that the application substitutes for clinicians.
59.5 ExpenseEase depth
Keep it compact.
A visitor should understand it in seconds.
A useful presentation is:
> A React expense tracker that takes income and expenses, manages user
> input with React Hooks, and calculates the remaining balance.
Do not create an artificial architecture diagram for a simple
calculator/tracker unless the existing UI already supports one.
59.6 TinDog depth
Inspect first.
If the repository is primarily a frontend tutorial implementation,
describe it accordingly.
The portfolio does not need to hide tutorial/practice projects. It
simply should not overstate them.
59.7 Grammar Scoring Engine depth
This should receive a proper ML pipeline explanation.
The key technical distinction is between:
learned representation from Wav2Vec 2.0;
traditional audio features;
dimensionality reduction;
regression.
The phrase "hybrid feature architecture" is appropriate because it
describes the actual design.
Explain why PCA is used:
The combined representation is large, so PCA reduces approximately 776
features to 50 components before the final regression model.
Explain the evaluation:
Pearson correlation captures relationship between predicted and target
scores, while RMSE measures prediction error magnitude.
Do not invent an exact score unless the repository/source contains it.
59.8 ReelAlchemy depth
Keep the main content compact.
The important implementation is API integration:
Search input → OMDb request → response parsing → movie card rendering.
If source inspection reveals error handling, loading state, debouncing,
pagination or caching, add it. Otherwise do not claim it.
59.9 Eye Controlled Wheelchair depth
This deserves a deeper case-study treatment because it combines
software, ML, computer vision and hardware.
Explain the development loop:
capture camera data;
detect face;
locate facial landmarks;
derive eye-related information;
create training examples;
train classifier;
run inference;
map prediction to command;
send command over serial;
provide GUI controls/feedback.
If source code identifies exact facial features, classifier details or
serial protocol, those can be included.
Do not invent safety guarantees.
59.10 Retrogroove depth
Explain it as a full-stack application.
The strongest content is not the visual appearance but the connection
between:
authenticated users;
music data;
database;
upload flow;
reusable UI;
application state.
If the source includes a specific Supabase storage bucket or table
architecture, it can be described, but only after verification.
59.11 Heart-Attack-Prediction-Analysis depth
The project should communicate a complete data-science workflow:
Dataset → cleaning → missing-value handling → outlier processing →
scaling → EDA → model comparison → evaluation → feature analysis.
The use of PyCaret is useful, but the project should not be reduced to
"used PyCaret."
The individual models matter because they demonstrate understanding of
model comparison.
The portfolio can mention:
Logistic Regression;
Decision Tree;
Random Forest;
KNN;
Gradient Boosting.
Do not claim that the project can diagnose heart attacks.
59.12 Fake-news stacked model depth
This should be connected to the M.Tech research.
The project is the baseline/research predecessor.
Explain that it tested multiple families of models:
Classical ML: SVM, Logistic Regression, Decision Tree, KNN, Random
Forest variants.
Deep learning: CNN, Uni-LSTM, Bi-LSTM, Uni-GRU, Bi-GRU.
Then explain the stacked ensemble.
This makes the project valuable even though the later thesis uses
transformers.
---
60. HOW TO REPRESENT TECHNOLOGY AS ENGINEERING
Technology names should always be connected to a purpose.
Examples:
Next.js
Do not merely say "Next.js."
Explain that it provides the application framework for the web project.
TypeScript
Use it to describe typed frontend/full-stack development where relevant.
Prisma
Explain that it provides ORM/database access in the listing project.
Supabase
Explain its role in backend/data/authentication functionality where
confirmed.
Pinecone
Explain its role as the vector database in MediSense-Ai.
Wav2Vec 2.0
Explain that it provides learned speech representations.
XGBoost
Explain that it performs the final regression in the grammar-scoring
pipeline.
OpenCV/Dlib
Explain their role in the computer-vision pipeline.
Transformers
Explain their role in contextual text representation and classification.
This principle should be used throughout the portfolio.
---
61. DO NOT TURN THE PORTFOLIO INTO A README DUMP
A GitHub README answers:
> How do I run this repository?
A portfolio answers:
> What did this engineer build, why does it matter, and how does it
> work?
Therefore, do not copy READMEs verbatim.
Extract the engineering story.
For example, instead of copying a list of Python dependencies from the
eye-controlled wheelchair README, explain the processing pipeline and
hardware interaction.
Instead of copying every notebook title from the fake-news repository,
explain the evolution from baseline models to stacking.
Instead of copying every UI section in TravelMe, explain the responsive
frontend implementation.
---
62. HOW TO HANDLE SOURCE CODE DETAILS
Source code should be used to discover meaningful implementation
details.
Examples of useful source-level details:
API route structure;
server actions;
database schema;
authentication middleware;
reusable hooks;
model training scripts;
preprocessing functions;
vector-store operations;
serial-port commands;
component architecture;
state-management patterns.
Examples of low-value details:
every CSS class;
every dependency;
trivial helper functions;
generated files;
boilerplate;
lockfiles;
framework-generated code.
The portfolio should capture engineering decisions, not every line of
the repository.
---
63. HOW TO HANDLE TUTORIAL-DERIVED PROJECTS
Tutorial-derived projects should not automatically be deleted.
They can demonstrate:
framework familiarity;
implementation practice;
responsive design;
ability to follow and adapt a technical architecture.
However, the wording must not imply independent originality if the
source explicitly identifies a tutorial/template.
If the user later added substantial original functionality, document
that separately.
The key distinction is:
> "Built/implemented this project using X"
versus:
> "Invented/designed the complete product from scratch."
Use the first unless the second is supported.
---
64. HOW TO HANDLE PROJECTS WITH WEAK README FILES
A weak README does not mean the project is weak.
The source extraction process should inspect:
directory structure;
package.json;
source files;
routes;
database schema;
configuration;
notebooks.
The `listing` repository is a good example: a default create-next-app
README does not communicate the actual full-stack functionality.
Claude should therefore derive the project explanation from
implementation evidence.
The opposite also applies: a detailed README should not be blindly
trusted if the source code contradicts it.
---
65. HOW TO HANDLE DUPLICATE OR EVOLVED PROJECTS
Projects may overlap.
The fake-news GitHub implementation and M.Tech dissertation are intentionally the same broader project and should be represented as complementary sources, not as two separate portfolio projects.
The GitHub repository provides the implementation.
The dissertation provides the complete research documentation.
Do not create two competing portfolio entries for them.
Instead:
Fake-news stacked model
Represents:
> initial ML/DL exploration and stacked-ensemble implementation.
M.Tech dissertation
Represents:
> extended research framework that used the earlier baseline to motivate
> transformer-based contextual modelling, ensemble strategies and
> cross-domain verification.
This gives both projects a distinct purpose.
---
66. PROJECT CONTENT SHOULD BE DATA-DRIVEN
The content should remain separated from core scene/UI code.
Adding a project should not require rewriting:
world components;
navigation;
character logic;
scene architecture;
core UI components.
Likewise, updating a project description should not require editing the
3D scene.
The portfolio's existing data-driven architecture should be respected.
If the current implementation already has content files, use them.
Do not introduce a second competing content system.
---
67. HOW TO HANDLE OPTIONAL INFORMATION
Not every project has:
a live demo;
numerical results;
research publication;
video;
detailed architecture;
database;
AI model.
Optional information should simply be omitted.
Do not fill missing sections with placeholders.
A project with four strong facts is better than a project padded with
six invented facts.
---
68. PROJECT CARD WRITING RULES
The project card should answer:
> What is this?
within a few seconds.
Examples:
Eye Controlled Wheelchair
> Hands-free wheelchair control using eye movement and facial landmarks,
> with model training, desktop controls and serial hardware
> communication.
Grammar Scoring Engine
> Hybrid speech-scoring pipeline combining Wav2Vec 2.0 embeddings with
> acoustic features and XGBoost regression.
MediSense-Ai
> Medical-domain RAG system combining document ingestion, embeddings,
> Pinecone retrieval and LLM inference for pregnancy and gynecology
> content.
Fake News Research
> Transformer-driven fake-news detection framework extending an ML/DL
> stacked baseline across LIAR, Politifact, GossipCop and multilingual
> data.
These descriptions are concise but technically meaningful.
---
69. DETAILED VIEW WRITING RULES
The detailed view should progressively reveal information.
Start with the problem.
Then the system.
Then the implementation.
Then the result.
This is more readable than starting with a giant technology list.
Recommended sequence:
Problem → Solution → Architecture → Implementation → Results →
Limitations
For software projects without numerical results:
Problem → Solution → Architecture → Features → Technical
implementation
---
70. VISUAL CONTENT
Where project screenshots, diagrams or media already exist, use them
when they materially help explain the project.
Useful visuals include:
application screenshots;
architecture diagrams;
model pipeline diagrams;
wheelchair GUI;
music application UI;
property listing UI;
fake-news result visualisations.
Do not create fake screenshots.
Do not create artificial benchmark charts.
Do not present generated illustrations as actual application
screenshots.
If a visual is generated for decorative purposes, it must not be
presented as evidence of implementation.
---
71. RESEARCH RESULT VISUALIZATION
The fake-news thesis can benefit from a compact results presentation.
A useful conceptual structure is:
Evaluation                                            Result
---
ISOT preliminary stacked baseline          ~99.85% accuracy
LIAR binary preliminary baseline           ~71.03% accuracy
LIAR binary final verified                   80.42% accuracy
LIAR six-class final verified                45.91% accuracy
Politifact primary verification              91.95% accuracy
GossipCop primary verification               87.62% accuracy
PolyglotFakeFacts primary verification       99.61% accuracy
The UI should clearly distinguish:
preliminary baseline;
final verified result;
external verification.
Do not imply that the numbers are directly interchangeable because they
correspond to different datasets and experimental settings.
---
72. RESEARCH STORY IN ONE PARAGRAPH
The final portfolio should be capable of communicating the entire
research project in a paragraph:
> The work began with a classical ML/deep-learning stacked ensemble for
> fake-news detection, achieving near-perfect performance on ISOT but
> substantially lower performance on the short-claim LIAR dataset. This
> motivated a transformer-based framework using DistilBERT, BERT and
> RoBERTa, combined through voting, probability fusion,
> validation-weighted averaging, threshold tuning and stacked
> meta-classification. The resulting system improved LIAR binary
> performance to a verified 80.42% accuracy and was further evaluated on
> six-class LIAR, Politifact, GossipCop and PolyglotFakeFacts. Metadata
> and graph-based experiments were kept separate as diagnostics because
> source/domain information can leak labels.
This paragraph should be considered the canonical high-level research
summary.
---
73. ENGINEERING STORY ACROSS THE PORTFOLIO
The portfolio contains multiple technical domains.
The content should allow a visitor to discover a progression without
forcing a chronological biography.
The projects collectively demonstrate work across:
Frontend
React;
Next.js;
TypeScript;
Tailwind;
responsive UI;
API integration.
Full stack
authentication;
Prisma;
databases;
Supabase;
application state;
server-side logic.
AI/ML
classical ML;
deep learning;
transformers;
ensemble methods;
regression;
evaluation.
Computer vision
OpenCV;
Dlib;
facial landmarks;
eye movement;
model inference.
Speech
Wav2Vec 2.0;
acoustic features;
prosody;
XGBoost.
LLM/RAG
document ingestion;
embeddings;
vector databases;
retrieval;
LLM inference.
Research
experimental comparison;
validation protocols;
cross-domain evaluation;
multilingual evaluation;
leakage analysis.
This is the underlying technical breadth the portfolio should reveal.
---
74. FINAL ACCEPTANCE CRITERIA
The content implementation is complete only when:
Every meaningful project has been inspected.
The two excluded GitHub repositories remain excluded.
The thesis is included as a first-class project.
The fake-news baseline and thesis are connected but not duplicated.
Project descriptions are based on implementation evidence.
Major projects have enough technical depth.
Small projects remain concise.
Numerical results are contextualized.
No unsupported claims are added.
No fake links are added.
No unnecessary metadata fields are introduced.
Existing content architecture is reused.
Existing 3D/world design is preserved.
Future work is not presented as completed work.
Tutorial-derived work is not falsely represented as completely
original.
Medical/accessibility projects are not presented with unsupported
clinical claims.
The fake-news system is not falsely described as evidence-aware fact
checking.
Metadata leakage results are not presented as the main performance
claim.
Live demos are shown only when an actual link exists.
The final writing is concise where it should be and deeply technical
where the project warrants it.
---
75. FINAL HANDOFF STATEMENT
The goal is not to make the portfolio contain more text.
The goal is to make every meaningful project capable of answering the
visitor's natural questions:
> What is this?
> Why did you build it?
> What did you actually implement?
> How does it work?
> What technologies did you use?
> What was technically difficult?
> What did the experiments show?
> Can I see it?
The first answer should be immediate.
The deeper answers should become available as the visitor explores.
The M.Tech fake-news research, eye-controlled wheelchair,
grammar-scoring engine and MediSense-Ai should expose substantially more
technical depth than simple frontend projects because their
engineering/research content supports it.
The portfolio should therefore behave like a visual experience on the
surface and a technically detailed engineering portfolio underneath.
Do not add complexity merely to make the project descriptions appear
sophisticated.
Use the actual work.
Use the actual evidence.
Preserve the technical story.
Do not invent the rest.

# Vishav Mehra — Portfolio Project Content Pack

> **For the Claude session in VS Code:** this document is the single source of truth for the
> **Projects** section of Vishav Mehra's portfolio. The projects are shown in a **card carousel**.
> Every project below has:
>
> 1. **Card fields**: the short content that fits on a carousel card (title, tagline, blurb,
>    tags, year, links, image, metric chips).
> 2. **Detail content**: longer copy for a modal, expandable panel, or `/projects/[slug]` page
>    (overview, problem, approach, architecture, features, stack, results, challenges, learnings,
>    next steps).
> 3. **Resume bullets**: optional one-liners you can reuse elsewhere on the site.
>
> At the end there is a **ready-to-paste TypeScript data file** (`projectsData`) plus a
> `skillsData` list and profile/social links. Prefer importing from that data file instead of
> hard-coding copy inside components.
>
> All facts, numbers and hyperparameters below were taken directly from the code, notebooks and
> saved outputs in each GitHub repository. **Do not inflate or round metrics upward**, and do
> not add features that are not listed here.

---

## 0. How to use this content

### 0.1 Recommended carousel order

Show the strongest, most recent AI/ML work first, then full-stack apps, then early learning
projects. Suggested order and `featured` flag:

| # | Project | Category | Year | Featured |
|---|---|---|---|---|
| 1 | Fake News Detection: Stacked Ensembles & Transformers | AI / NLP Research | 2025 | ✅ |
| 2 | MediSense AI: Medical LLM with LoRA + RAG | Generative AI / LLM | 2025 | ✅ |
| 3 | AI Grammar Scoring Engine (Speech) | AI / Audio ML | 2025 | ✅ |
| 4 | Eye-Controlled Wheelchair | Computer Vision / Assistive Tech | 2024 | ✅ |
| 5 | Heart Attack Prediction Analysis | Machine Learning / Healthcare | 2024 | ✅ |
| 6 | Retrogroove: Music Streaming Platform | Full-Stack Web | 2024 | ✅ |
| 7 | Rentify: Property Rental & Booking Platform | Full-Stack Web | 2024 | ✅ |
| 8 | NexTalk: Real-Time Chat App (MERN) | Full-Stack Web | 2023 | |
| 9 | Authors: Author & Post Manager | Full-Stack Web | 2024 | |
| 10 | TravelMe: Travel Landing Page | Frontend | 2024 | |
| 11 | ReelAlchemy: Movie Search App | Frontend / React | 2023 | |
| 12 | ExpenseEase: Expense Tracker | Frontend / React | 2023 | |
| 13 | TinDog: Responsive Landing Page | Frontend / HTML-CSS | 2023 | |

A good UI pattern is **category filter chips** above the carousel
(`All · AI / ML · Full-Stack · Frontend`) with the carousel showing `featured` projects by
default.

### 0.2 Card layout this content is written for

```
┌───────────────────────────────────────┐
│ [cover image / gradient + icon]       │
│ CATEGORY · YEAR                       │
│ Title                                 │
│ Tagline (≤ 80 chars)                  │
│ Blurb (≤ 200 chars)                   │
│ [metric chip] [metric chip] [chip]    │
│ #tag #tag #tag #tag                   │
│ [GitHub]  [Live demo]  [Details →]    │
└───────────────────────────────────────┘
```

- **Tagline** is ≤ 80 characters and **blurb** ≤ 200 characters, so they fit without truncation.
- **Metric chips** are 2–3 short highlight strings, e.g. `76.5% LIAR accuracy`.
- **Tags** are the 4–7 most recognisable technologies. The full stack is in the detail content.
- Only show the **Live demo** button when `live` is set. Live URLs came from Vishav's earlier
  portfolio code, so check each one still loads before shipping and set `live: undefined` if not.

### 0.3 Cover images

| Project | Suggested cover |
|---|---|
| Retrogroove, Rentify (listing), Authors, TravelMe | Screenshots already exist in the `personal-portfolio` repo: `public/retrogroove.png`, `public/listing.png`, `public/authors.png`, `public/travelme.png`. Copy them (download them before that repo is deleted) into the new portfolio's `public/projects/` folder. |
| MediSense AI | A frame from `demo.mp4` in the MediSense-Ai repo, or the demo video itself as a hover preview |
| Eye-Controlled Wheelchair | A screenshot of the PyQt5 GUI, or a sample eye crop from `scripts/dataset/` with the arrow icons from `images/` |
| Fake News, Grammar Engine, Heart Attack | No screenshots in the repos. Use a clean gradient card with an icon (newspaper / waveform / heart-pulse) or export a chart from the notebooks |
| NexTalk, ReelAlchemy, ExpenseEase, TinDog | Take a fresh screenshot after running locally, or use a gradient + icon card |

### 0.4 Scope

The portfolio covers **13 projects**: every public repository on
https://github.com/vishavmehra except the GitHub profile README (`vishavmehra/vishavmehra`) and
the old portfolio site (`personal-portfolio`). Do not add either of those as project cards.

### 0.5 Journey timeline (optional "My Journey" section)

A vertical timeline component can use this progression. It shows growth from frontend basics
to full-stack apps to applied AI research.

| When | Milestone | Projects |
|---|---|---|
| Jul 2023 | Started with frontend fundamentals: semantic HTML, CSS and Bootstrap layouts, then React with hooks, styled-components and third-party REST APIs | TinDog, ReelAlchemy, ExpenseEase |
| Sep 2023 | First full-stack application: MERN stack with WebSockets, JWT auth and group messaging | NexTalk |
| Jan 2024 | Moved to Next.js 13 and TypeScript: server-side data fetching, Supabase and Prisma, OAuth, cloud storage and Vercel deployments | Retrogroove, Rentify, TravelMe |
| Feb 2024 | API routes, CRUD and modal-driven state management | Authors |
| Jul 2024 | Applied computer vision to assistive hardware: landmarks, HOG features, a PyQt5 GUI and serial control | Eye-Controlled Wheelchair |
| Nov 2024 | Healthcare ML and AutoML model comparison | Heart Attack Prediction Analysis |
| Apr 2025 | Generative AI: LoRA fine-tuning of Llama 3.2 plus a RAG pipeline with Pinecone | MediSense AI |
| Apr 2025 onward | NLP research: 20+ models across 5 fake-news datasets, transformer ensembles, a GCN and leakage auditing | Fake News Detection |
| Dec 2025 | Speech ML: Wav2Vec 2.0 embeddings plus prosody features for grammar scoring | AI Grammar Scoring Engine |

Suggested one-line summary for the timeline header: *"From Bootstrap landing pages to
fine-tuned LLMs, two and a half years of building."*

### 0.6 SEO descriptions & image alt text

Use `seo` for `<meta name="description">` on `/projects/[id]` pages (each is under 160
characters) and `alt` for the cover image.

| id | seo (meta description) | alt (cover image) |
|---|---|---|
| fake-news-detection | Fake news detection with LSTM, GRU, CNN, SVM, Random Forest, stacked ensembles and fine-tuned BERT models across five benchmark datasets. | Chart comparing fake news detection model accuracy across datasets |
| medisense-ai | MediSense AI: a pregnancy and gynecology chatbot using a LoRA-fine-tuned Llama 3.2 model with retrieval-augmented generation on Pinecone. | MediSense AI Streamlit chat interface answering a pregnancy question |
| grammar-scoring-engine | Speech grammar scoring from raw audio using Wav2Vec 2.0 embeddings, prosodic features and XGBoost, with 5-fold cross-validation. | Predicted versus actual grammar score scatter plot |
| eye-controlled-wheelchair | Hands-free wheelchair control using webcam eye tracking, dlib facial landmarks, HOG features and a PyQt5 control app. | Eye-controlled wheelchair app showing a detected gaze direction arrow |
| heart-attack-prediction | Heart attack risk prediction with exploratory analysis and a PyCaret comparison of 15 classifiers; best model 85.2% accuracy. | Model comparison table for heart disease prediction |
| retrogroove | Retrogroove: a Next.js and Supabase music streaming app with song uploads, likes, search and a persistent audio player. | Retrogroove music streaming app home screen |
| rentify | Rentify: an Airbnb-style property rental platform built with Next.js, Prisma, MongoDB, NextAuth, Cloudinary and Leaflet maps. | Rentify property listings grid with category filters |
| nextalk | NexTalk: a MERN real-time chat app with Socket.io messaging, typing indicators, notifications and group chats. | NexTalk chat window with a group conversation |
| authors | Authors: a Next.js and TypeScript app for managing authors and posts through REST API routes and modal forms. | Authors app showing author and post cards |
| travelme | TravelMe: a responsive travel and camping landing page built with Next.js and Tailwind CSS. | TravelMe landing page hero section with mountain imagery |
| reelalchemy | ReelAlchemy: a React movie search app powered by the OMDb API with instant results and detailed movie info. | ReelAlchemy movie search results as poster cards |
| expenseease | ExpenseEase: a React expense tracker with income and expense totals, live balance and searchable transactions. | ExpenseEase balance overview and transaction list |
| tindog | TinDog: a responsive Bootstrap landing page with features, testimonials and pricing plans. | TinDog landing page hero with phone mock-up |

---

## 1. Profile & contact details

Use these in the hero, footer and contact section.

| Field | Value |
|---|---|
| Name | Vishav Mehra |
| Headline | AI/ML Engineer & Full-Stack Developer |
| Location | New Delhi, India |
| Education (from GitHub profile) | M.Tech (ISP) |
| Email | mehravishav26@gmail.com |
| GitHub | https://github.com/vishavmehra |
| LinkedIn | https://www.linkedin.com/in/vishav-mehra-755107208 |
| LeetCode | https://leetcode.com/vishav__mehra |
| HackerRank | https://www.hackerrank.com/mehravishav26 |
| Codeforces | https://codeforces.com/profile/ThinkAgain |
| GeeksforGeeks | https://auth.geeksforgeeks.org/user/mehravishav26 |
| CodeChef | https://www.codechef.com/users/mehravishav26 |

**Short bio (for the About section):**

> I'm Vishav, an AI/ML engineer and full-stack developer from New Delhi. I build end-to-end
> machine-learning systems, from fake-news detectors that combine classic ML, deep learning and
> fine-tuned transformers, to a medical assistant that pairs a LoRA-fine-tuned Llama 3.2 with
> retrieval-augmented generation. I also ship production-style web apps with Next.js,
> TypeScript, Supabase, Prisma and the MERN stack. My current focus is Generative AI, LLMs and
> deep learning, alongside data structures and algorithms.

**Current-focus line (from the GitHub profile):** "Currently working on Gen AI / LLMs and Deep
Learning techniques, and sharpening DSA skills."

---

## 2. Fake News Detection: Stacked Ensembles & Transformers

### 2.1 Card fields

| Field | Value |
|---|---|
| `id` / slug | `fake-news-detection` |
| Title | Fake News Detection: Stacked Ensembles & Transformers |
| Tagline | 20+ models, 5 datasets: from LSTMs to fine-tuned BERT ensembles |
| Blurb | Research-grade fake-news detection benchmarking deep learning, classic ML, a custom stacked ensemble and fine-tuned DistilBERT/BERT/RoBERTa across ISOT, LIAR, GossipCop, PolitiFact and a multilingual dataset. |
| Category | AI / NLP Research |
| Year | 2025 |
| Status | Completed (research project) |
| Metric chips | `99.76% ISOT accuracy` · `76.5% LIAR (binary)` · `5 datasets, 18 languages` |
| Tags | Python, PyTorch, Hugging Face Transformers, TensorFlow/Keras, scikit-learn, NLP, Ensemble Learning |
| GitHub | https://github.com/vishavmehra/Fake-news-detection-stacked-model-implementation |
| Live | none |
| Featured | yes |

### 2.2 Overview

A large-scale study of automatic fake-news detection. The project compares three generations of
models: recurrent/convolutional deep learning, classic machine learning, and fine-tuned
transformers. It combines them with ensembling and stacking, and tests them on five public
datasets that range from full news articles to one-sentence political claims to multilingual
news in 18 languages.

### 2.3 Problem

Misinformation spreads faster than manual fact-checking can keep up. Models that score near
100% on one benchmark often fail on shorter, noisier or differently sourced text. The goals
were to (a) find which model families actually work, (b) measure whether combining them helps,
and (c) check how well a single pipeline generalises across very different datasets.

### 2.4 Approach

**Phase 1: ISOT (long news articles, 44,898 articles)**
- Cleaned and de-duplicated the data (209 duplicates removed), then built a text pipeline:
  NLTK stop-word removal → spaCy lemmatisation → normalisation (lower-casing, removing
  repeated characters, digits and punctuation).
- Trained 5 deep-learning models in Keras: **Uni-LSTM, Bi-LSTM, Uni-GRU, Bi-GRU and a 1-D CNN**
  (128-dimensional embeddings, sequences of 300 tokens, 10k vocabulary, early stopping).
- Trained 6 classic ML models on TF-IDF / term-frequency features: **SVM, Logistic Regression,
  Decision Tree, KNN and two Random Forests**.
- Built a **stacked ensemble** that feeds all 11 models' predictions into a Random Forest
  meta-classifier.

**Phase 2: LIAR (short political claims, 12,836 statements)**
- Applied the same pipeline to LIAR for **binary** (fake/real) and **6-class** truthfulness
  (pants-fire → true). Accuracy dropped sharply on one-sentence claims, which motivated the
  next phase.
- Built a **transformer pipeline**: fine-tuned **DistilBERT, BERT and RoBERTa** on the claim
  plus speaker metadata (subject, speaker, job, state, party, context, credit history),
  written as one structured text string.
- Added a **speaker-credibility model** (smoothed target encoding plus credit-history ratios →
  Logistic Regression) and a **Graph Convolutional Network**. The GCN links each claim to its
  speaker, subjects, party, state, venue and job-title nodes.
- Combined everything with **majority vote, probability averaging, validation-weighted
  averaging, exhaustive validation-selected subsets, tuned decision thresholds, a stacked
  Logistic-Regression meta-learner, a transformer–GCN blend**, and a **hierarchical 6-class
  model** (a binary gate routes each claim to fake-subtype or real-subtype classifiers).

**Phase 3: Cross-dataset generalisation**
- Retrained the transformer ensemble from scratch on **GossipCop** (22k celebrity-news
  headlines), **PolitiFact** (1k political headlines) and **PolyglotFakeFacts** (10k articles
  in 18 languages, official 80/20 split).
- Added TF-IDF (word + character n-gram) and metadata baselines, and exported per-class
  precision/recall/F1 tables, confusion matrices and prediction files for every method.

**Evaluation audit.** The results were checked for leakage. The audit found shortcut signals,
such as a source-file column that encodes the label and source-domain cues, and documented them
so that reported numbers stay honest.

### 2.5 Architecture

```
Raw text + metadata
   ├─► Classic pipeline: clean → lemmatise → TF-IDF / Keras tokenizer
   │      ├─ 5 DL models (LSTM/GRU/CNN) ─┐
   │      └─ 6 ML models (SVM/LR/DT/KNN/RF×2) ─┴─► Random-Forest stacked meta-model
   └─► Transformer pipeline: "statement: … speaker: … party: … history: …"
          ├─ DistilBERT / BERT / RoBERTa (class-weighted, best-macro-F1 checkpoint)
          ├─ TF-IDF + LR baseline · credibility baseline · metadata GCN
          └─► vote / average / weighted / subset-search / threshold / stacked LR / GCN blend
```

### 2.6 Key features

- 20+ trained models across 3 model families and 5 datasets.
- Binary **and** 6-class truthfulness classification on LIAR.
- Custom GCN over claim–metadata graphs, written in plain PyTorch with sparse matrices.
- Hierarchical classification (binary gate → subtype experts).
- Reproducible, versioned outputs: every notebook writes CSV result tables, per-class reports,
  threshold-tuning tables, model weights and test-set predictions.
- Clean repository layout (`datasets/`, `notebooks/01_ISOT`, `02_LIAR`,
  `03_cross_dataset_transformers`) with a detailed README.

### 2.7 Tech stack

- **Languages:** Python
- **Deep learning:** TensorFlow / Keras (LSTM, GRU, CNN), PyTorch, Hugging Face Transformers
  (Trainer API, fp16 on an NVIDIA RTX 2060)
- **Classic ML:** scikit-learn (SVM, LR, DT, KNN, Random Forest, TF-IDF, stacking)
- **NLP:** NLTK, spaCy (`en_core_web_sm`)
- **Graph ML:** custom 2-layer GCN (PyTorch sparse)
- **Data/plots:** pandas, NumPy, Matplotlib, Seaborn, WordCloud
- **Environments:** Google Colab, local CUDA

### 2.8 Results

| Dataset | Task | Best method | Accuracy |
|---|---|---|---|
| ISOT | Binary | Random Forest (term-frequency features) | **99.76%** |
| ISOT | Binary | 1-D CNN (best deep model) | 99.75% |
| LIAR | Binary | Classic stacked ensemble (statement only) | 71.0% |
| LIAR | Binary | **Transformer ensemble** (validation-selected) | **76.5%** (macro-F1 0.758) |
| LIAR | 6-class | Stacked transformer + credibility meta-model | **44.8%** (macro-F1 0.455) |
| GossipCop | Binary | Transformer ensemble + tuned threshold | **87.6%** |
| PolitiFact | Binary | TF-IDF + Logistic Regression | **92.0%** |
| PolyglotFakeFacts | Binary | Transformer ensemble + tuned threshold | **97.2%** |

Key takeaways:
- Bidirectional recurrent models clearly beat unidirectional ones on ISOT (Bi-LSTM 99.2% vs
  Uni-LSTM 96.2%).
- On LIAR, adding speaker metadata and fine-tuning transformers raised binary accuracy from
  about 62% (classic ML on the statement alone) to **76.5%**. 6-class accuracy went from about
  26% to **44.8%**.
- Stacking added about 9 accuracy points over the best single classic model on LIAR.

> Display note: use the numbers in this table. Do **not** quote 99.85% (ISOT stacked model) or
> the 100% results in the repo. The README documents those as evaluation artefacts (in-sample
> scoring and label leakage).

### 2.9 Challenges & how I solved them

- **Short texts break long-text models.** Models that scored ~99% on articles fell to ~60% on
  one-sentence claims. I moved to transformers and fed speaker metadata and credit history in as
  structured text.
- **Class imbalance** (GossipCop is about 3:1 real to fake). I used class-weighted
  cross-entropy, macro-F1 checkpoint selection and validation-tuned decision thresholds.
- **Unstable fine-tuning.** RoBERTa collapsed to a single class on the 6-class task, so I added
  validation-based subset selection and weighting so that weak models can't drag an ensemble
  down.
- **Hidden leakage.** Suspicious 100% scores led me to audit the features. I traced them to a
  file-name column that encoded the label, and wrote up the fix and the caveats.

### 2.10 What I learned

- High benchmark accuracy can reflect dataset shortcuts (source style, file names, domains)
  rather than real understanding. Cross-dataset testing and leakage audits are essential.
- How to design ensembles that are chosen on validation data, never on the test set.
- Practical transformer fine-tuning on a 6 GB GPU: fp16, gradient accumulation, early stopping
  and checkpoint hygiene.

### 2.11 Future work

Cross-dataset transfer (train on one dataset, test on another), evidence-based verification with
LIAR-PLUS justifications, multilingual transformers (XLM-R) for PolyglotFakeFacts, and a small
demo API or Streamlit app.

### 2.12 Resume bullets

- Benchmarked 20+ fake-news detection models (LSTM/GRU/CNN, SVM/RF, DistilBERT/BERT/RoBERTa)
  across 5 datasets, reaching 99.76% on ISOT and 76.5% binary / 44.8% 6-class on LIAR.
- Designed a transformer + speaker-credibility + graph-convolutional ensemble that lifted LIAR
  binary accuracy by about 14 points over classic ML baselines.
- Audited evaluation pipelines and identified label-leakage and source-shortcut artefacts,
  producing corrected, reproducible benchmarks.

---

## 3. MediSense AI: Medical Assistant with LoRA-Fine-Tuned Llama 3.2 + RAG

### 3.1 Card fields

| Field | Value |
|---|---|
| `id` / slug | `medisense-ai` |
| Title | MediSense AI |
| Tagline | A gynecology & pregnancy assistant powered by fine-tuned Llama 3.2 and RAG |
| Blurb | Domain-specific medical chatbot that combines a LoRA-fine-tuned Llama-3.2-1B with retrieval-augmented generation over Wikipedia and PDF knowledge stored in Pinecone, served through a Streamlit chat UI. |
| Category | Generative AI / LLM |
| Year | 2025 |
| Status | Completed (demo video in repo) |
| Metric chips | `Llama 3.2 · LoRA r=16` · `RAG with Pinecone` · `2 answer modes` |
| Tags | Python, PyTorch, Hugging Face, PEFT/LoRA, LangChain, Pinecone, Streamlit |
| GitHub | https://github.com/vishavmehra/MediSense-Ai |
| Live | none (show `demo.mp4` as the preview) |
| Featured | yes |

### 3.2 Overview

MediSense AI (branded **"LLAMA, MD"** inside the app) answers patient questions about
pregnancy, childbirth and gynecology. The user picks between two answer modes in the sidebar:

1. **Fine-Tune mode:** a Llama-3.2-1B model adapted with LoRA on doctor–patient conversations
   answers directly, prompted to give a diagnosis and next steps.
2. **RAG mode:** the question is embedded, the 5 most relevant knowledge chunks are retrieved
   from a Pinecone vector index, and the fine-tuned model answers grounded in that context.

### 3.3 Problem

General-purpose LLMs are either too generic or prone to hallucination on specialised medical
questions. A small open model that is both **specialised** (through fine-tuning) and
**grounded** (through retrieval) is cheaper to run and easier to control than a large hosted
model.

### 3.4 Approach

**Data & exploration**
- Used the Hugging Face dataset `ruslanmv/ai-medical-chatbot`, which has Description / Patient /
  Doctor fields.
- Ran **topic modelling** (TF-IDF + Truncated SVD / LSA) over the three fields, using custom
  frequency-based stop-words, to understand the dominant medical topics before fine-tuning.
- Built a **Wikipedia scraper** with LangChain's `WikipediaLoader` and `wikipedia-api`. It pulls
  up to 50 pregnancy-related articles and keeps only the informative sections (it drops
  History, References, See also and External links).
- Built a **PDF reader** (pdfplumber) to turn medical books and PDFs into raw text for the
  knowledge base.

**Fine-tuning**
- Base model: `meta-llama/Llama-3.2-1B` loaded in fp16.
- **LoRA** through PEFT: rank 16, alpha 32, dropout 0.1, applied to the attention `q_proj` and
  `v_proj` layers (a small fraction of the model's parameters are trainable).
- Used Llama 3 chat-format prompts with system / description / patient / doctor roles.
- Training: AdamW (lr 2e-5), batch size 2 with 8-step gradient accumulation, 2,048-token
  context, 90/10 train/validation split, up to 10 epochs. Validation loss and **perplexity**
  were tracked every epoch, with a LoRA adapter checkpoint saved per epoch.

**Retrieval-Augmented Generation**
- Pre-processing: text cleaning, then LangChain `RecursiveCharacterTextSplitter`
  (1,500-character chunks, 150 overlap), keeping titles as metadata.
- Embeddings: `WhereIsAI/UAE-Large-V1`, using CLS pooling and a retrieval instruction prefix for
  queries. **Amazon Titan Text Embeddings v2** through **AWS Bedrock** is a pluggable
  alternative.
- Vector store: **Pinecone serverless** index (created automatically if missing), top-5
  similarity search, with chunk text stored in metadata.
- The prompt places the retrieved context in front of the fine-tuned model, which answers as a
  gynecology/obstetrics specialist.

**App**
- **Streamlit** chat interface with persistent chat history, a mode selector (Fine-Tune / RAG),
  a clear-chat button, usage tips, a loading spinner and per-answer response times.

### 3.5 Architecture

```
            ┌──────── Knowledge ingestion ─────────┐
Wikipedia ─►│ scrape → clean → chunk (1500/150)     │
PDFs ──────►│ → UAE-Large-V1 / Titan embeddings     │──► Pinecone index
            └───────────────────────────────────────┘
User question ─► Streamlit ─┬─ Fine-Tune mode ─► Llama-3.2-1B + LoRA ─► answer
                            └─ RAG mode ─► embed → top-5 chunks → prompt → Llama-3.2-1B + LoRA ─► grounded answer
```

### 3.6 Key features

- Two answer strategies side by side (fine-tuned only vs retrieval-grounded), which makes it
  easy to compare hallucination and grounding.
- Parameter-efficient fine-tuning that runs on a single consumer GPU.
- Pluggable embedding back-ends (Hugging Face locally, or AWS Bedrock Titan).
- End-to-end data tooling: topic modelling, Wikipedia scraping, PDF ingestion and vector
  upserts.
- The trained LoRA adapter and tokenizer are shipped in `models/`, with a demo video.

### 3.7 Tech stack

- **LLM:** Llama-3.2-1B, Hugging Face Transformers, PEFT (LoRA), PyTorch
- **RAG:** LangChain, Pinecone (serverless), UAE-Large-V1 embeddings, AWS Bedrock (Titan
  Embeddings v2), boto3
- **Data:** Hugging Face Datasets, wikipedia-api, pdfplumber, scikit-learn (TF-IDF, Truncated
  SVD), NLTK
- **App:** Streamlit, python-dotenv

### 3.8 Results

- A working chatbot demo with both modes, recorded in `demo.mp4`.
- A fine-tuned LoRA adapter for Llama-3.2-1B (about 6.8 MB of adapter weights), with loss and
  perplexity tracked per epoch.
- A reusable ingestion pipeline that turns Wikipedia and PDF sources into a searchable Pinecone
  knowledge base.

### 3.9 Challenges & how I solved them

- **GPU memory:** fine-tuning a 1B-parameter model with 2k-token contexts. Solved with LoRA,
  fp16 weights, a small batch size and gradient accumulation.
- **Noisy knowledge sources:** Wikipedia pages contain long History and Reference sections.
  The scraper keeps only medically relevant sections and cleans citation markers before
  chunking.
- **Response hygiene:** stripped special tokens and the echoed prompt from model output before
  display.

### 3.10 What I learned

Parameter-efficient fine-tuning, prompt formatting for Llama 3 chat templates, how chunk size
and overlap affect retrieval quality, and the trade-off between a model that "knows" (fine-tuned)
and a model that "looks it up" (RAG).

### 3.11 Future work

Evaluate answers with a medical QA benchmark and RAG metrics (faithfulness, context recall), add
source citations to RAG answers, add a safety disclaimer layer, and deploy on a GPU host.

### 3.12 Resume bullets

- Fine-tuned Llama-3.2-1B with LoRA (r=16) on doctor–patient dialogues to build a gynecology and
  pregnancy assistant, tracking validation loss and perplexity per epoch.
- Built a RAG pipeline (LangChain, UAE-Large-V1 / AWS Titan embeddings, Pinecone) over
  Wikipedia and PDF sources, served through a Streamlit chat app with fine-tuned and RAG modes.

---

## 4. AI Grammar Scoring Engine (Spoken English)

### 4.1 Card fields

| Field | Value |
|---|---|
| `id` / slug | `grammar-scoring-engine` |
| Title | AI Grammar Scoring Engine |
| Tagline | Scores spoken-English grammar (0–5) straight from raw audio |
| Blurb | Hybrid audio-ML pipeline that fuses Wav2Vec 2.0 speech embeddings with hand-crafted prosody features and a regularised XGBoost regressor to predict human grammar scores from 45–60 s voice recordings. |
| Category | AI / Speech & Audio ML |
| Year | 2025 |
| Status | Completed |
| Metric chips | `Pearson r = 0.47 (5-fold)` · `RMSE 0.67` · `774 features` |
| Tags | Python, PyTorch, Wav2Vec 2.0, Hugging Face, Librosa, XGBoost, scikit-learn |
| GitHub | https://github.com/vishavmehra/grammar-scoring-engine |
| Live | none |
| Featured | yes |

### 4.2 Overview

An automated grammar-assessment engine for spoken English, built for the **SHL Research Intern
hiring assessment (2025)**. Given a 45–60 second recording, it predicts a continuous grammar
score on a 0–5 MOS (Likert) scale that matches how human raters score grammatical correctness
and fluency.

### 4.3 Problem

Grading spoken grammar by hand is slow and inconsistent. The model has to learn from only
**409 labelled recordings** and generalise to **197 unseen test recordings**. That is a
small-data, high-dimensional problem where overfitting is the main risk.

### 4.4 Approach

1. **Pre-processing:** resample every clip to 16 kHz mono and trim silence with a 25 dB
   threshold, so that the models only analyse speech rather than dead air.
2. **Deep features:** pass audio through Facebook's pre-trained **`wav2vec2-base-960h`**
   transformer and **mean-pool** the last hidden layer into a 768-dimensional embedding. Clips
   are capped at 30 s for the transformer to avoid GPU out-of-memory errors.
3. **Hand-crafted acoustic features (6):**
   - Pitch (F0) mean, standard deviation and skew, using librosa's pYIN tracker (intonation and
     monotony)
   - RMS energy mean and standard deviation (confidence and loudness)
   - Zero-crossing-rate mean (a proxy for articulation and speech rate)
4. **Fusion:** 768 + 6 = **774 features** per clip, standardised.
5. **Model:** an **XGBoost regressor** tuned for small data: 1,500 trees, learning rate 0.005,
   max depth 4, row subsample 0.6, column subsample 0.4, early stopping after 100 rounds.
6. **Validation:** **5-fold cross-validation**, reporting RMSE and Pearson correlation per fold
   and on out-of-fold predictions. Predictions are clipped to the rubric range.
7. **Submission:** retrain on all 409 clips, predict the 197 test clips (clipped to 1–5) and
   verify the submission file's row count.

### 4.5 Key features

- A hybrid "deep + classical" feature design: semantic and phonetic context from a
  speech transformer, plus interpretable prosody statistics.
- GPU-accelerated feature extraction, wrapped in a reusable `GrammarScoringEngine` class.
- A regularised gradient-boosting setup suited to about 400 samples.
- Diagnostics: predicted-vs-actual scatter plot and residual distribution.

### 4.6 Tech stack

Python, PyTorch, Hugging Face Transformers (Wav2Vec2Processor / Wav2Vec2Model), Librosa,
SciPy, XGBoost, scikit-learn (StandardScaler, KFold), pandas, NumPy, Matplotlib, Seaborn,
Google Colab (GPU).

### 4.7 Results

| Fold | RMSE | Pearson r |
|---|---|---|
| 1 | 0.639 | 0.593 |
| 2 | 0.623 | 0.471 |
| 3 | 0.745 | 0.536 |
| 4 | 0.634 | 0.427 |
| 5 | 0.728 | 0.334 |
| **Average** | **0.674** | **0.472** |

Out-of-fold RMSE over all training clips was **0.676**, which is well under one scale point of
error on a 0–5 scale using only 409 training examples.

### 4.8 Challenges & how I solved them

- **Tiny dataset vs a 774-dimensional feature space.** Used heavy subsampling, shallow trees, a
  very low learning rate and early stopping.
- **Long audio vs GPU memory.** Trimmed silence, then capped transformer input at 30 s.
- **Silent or corrupt files.** Used safe fallbacks (zero vectors) so the pipeline never crashes
  mid-run.

### 4.9 What I learned

How self-supervised speech models encode more than phonetics, how to combine learned and
hand-crafted features, and how to validate honestly on small datasets with k-fold CV.

### 4.10 Future work

Add ASR transcripts (for example Whisper) and text-based grammar features, fine-tune Wav2Vec2
end-to-end, and try PCA or feature selection to reduce the embedding space.

### 4.11 Resume bullet

- Built a spoken-grammar scoring model that fuses Wav2Vec 2.0 embeddings with prosodic features
  (pitch, energy, ZCR) and a regularised XGBoost regressor, achieving Pearson r = 0.47 and
  RMSE 0.67 under 5-fold CV on 409 recordings.

---

## 5. Eye-Controlled Wheelchair

### 5.1 Card fields

| Field | Value |
|---|---|
| `id` / slug | `eye-controlled-wheelchair` |
| Title | Eye-Controlled Wheelchair |
| Tagline | Hands-free wheelchair control using only eye movements and a webcam |
| Blurb | Assistive computer-vision system that tracks the user's eye through facial landmarks, classifies gaze direction in real time with HOG features and a nearest-neighbour model, and sends movement commands to the wheelchair over serial. |
| Category | Computer Vision / Assistive Tech |
| Year | 2024 |
| Status | Completed (desktop app + hardware interface) |
| Metric chips | `5 commands` · `Real-time webcam` · `Per-user calibration` |
| Tags | Python, OpenCV, dlib, scikit-image (HOG), scikit-learn, PyQt5, Serial/UART |
| GitHub | https://github.com/vishavmehra/eye-controlled-wheelchair |
| Live | none |
| Featured | yes |

### 5.2 Overview

People with severe motor impairments often cannot use a joystick. This project turns an ordinary
webcam into a controller. The user looks **left, right, up or down**, or holds a **stop** gaze,
and the system converts that into wheelchair movement commands sent to the motor controller.

### 5.3 How it works

1. **Face detection:** an OpenCV Haar cascade finds the face in each webcam frame (640×480,
   mirrored).
2. **Landmarks:** dlib's **68-point facial-landmark predictor** locates the eye region, and the
   eye is cropped and resized to 250×100.
3. **Per-user calibration (Create Dataset):** the app records **100 eye samples per direction**
   for the specific user and saves them as labelled folders (for example `1.left`, `2.right`,
   `3.up`, `4.down`, `5.stop`).
4. **Training:** each sample becomes a **Histogram of Oriented Gradients (HOG)** feature vector
   (9 orientations, 10×10-pixel cells, 2×2 blocks, L1 normalisation), and a
   **k-nearest-neighbour classifier** (k = 1) is trained and pickled.
5. **Real-time detection:** every frame is classified. A small **debounce counter** requires
   consecutive agreeing frames before a command fires, which prevents jitter.
6. **Actuation:** the command is written to a **serial port (9600 baud)** on a background
   `QThread` so the wheelchair's microcontroller can drive the motors. The GUI shows a matching
   arrow or stop icon.

### 5.4 Key features

- A complete **PyQt5 desktop app** (designed in Qt Designer) with buttons for Create Dataset,
  Train, Open/Stop Camera, Start/Stop Detection and Exit.
- Live video preview with the detected direction overlaid.
- Personalised model: calibrates to each user's eyes in about a minute.
- Hardware-ready serial interface with an enable flag for testing without hardware.
- Standalone step-by-step scripts (`create_dataset.py`, `training.py`,
  `wheelchair_script.py`) that explain the pipeline before it was merged into one class.

### 5.5 Tech stack

Python, OpenCV (Haar cascades, video capture), dlib (68-point landmarks), imutils,
scikit-image (HOG), scikit-learn (KNN), PyQt5 (GUI, threads, signals/slots), pySerial, Pillow,
pickle, Windows SAPI / winsound for audio feedback.

### 5.6 Results

- Real-time 5-class gaze-direction control from a standard webcam, with no special eye-tracking
  hardware.
- A per-user dataset of labelled eye crops (the repository includes 300 sample images) and a
  saved model that loads instantly at start-up.

### 5.7 Challenges & how I solved them

- **Noisy frame-by-frame predictions:** added a consecutive-frame counter so a command only
  triggers when the gaze is held.
- **Different eyes, lighting and glasses:** chose per-user calibration with HOG features, which
  are robust to lighting changes, instead of one generic model.
- **Keeping the UI responsive:** serial communication runs in its own `QThread`, connected
  through Qt signals.

### 5.8 What I learned

Classical computer vision (cascades, landmarks, HOG), building responsive desktop GUIs with
PyQt5, and interfacing software with embedded hardware.

### 5.9 Future work

A CNN-based gaze classifier, blink-based start/stop commands, obstacle detection for safety,
and porting to a Raspberry Pi for a fully embedded build.

### 5.10 Resume bullet

- Developed a real-time eye-controlled wheelchair system (OpenCV, dlib, HOG + KNN, PyQt5) that
  classifies 5 gaze directions from a webcam and drives the motors over a serial interface,
  with per-user calibration.

---

## 6. Heart Attack Prediction Analysis

### 6.1 Card fields

| Field | Value |
|---|---|
| `id` / slug | `heart-attack-prediction` |
| Title | Heart Attack Prediction Analysis |
| Tagline | EDA and AutoML model comparison for cardiac-risk prediction |
| Blurb | Exploratory and statistical analysis of heart-failure patient records, followed by an automated comparison of 15 classifiers with PyCaret under different preprocessing strategies. Best model: 85.2% accuracy. |
| Category | Machine Learning / Healthcare |
| Year | 2024 |
| Status | Completed |
| Metric chips | `85.2% accuracy` · `15 models compared` · `3 preprocessing setups` |
| Tags | Python, PyCaret, scikit-learn, pandas, Matplotlib, Google Colab |
| GitHub | https://github.com/vishavmehra/Heart-Attack-Prediction-Analysis |
| Live | none |
| Featured | yes |

### 6.2 Overview

A healthcare analytics project that explores which clinical factors relate to cardiac events
and which machine-learning algorithms predict them best.

### 6.3 Approach

**Part 1: Heart-failure clinical records (299 patients, 12 clinical features + `DEATH_EVENT`)**
- Profiled the data (min/max highlighting, summary statistics, data types).
- Statistical visual analysis of the target against age, sex, creatinine phosphokinase,
  follow-up time and serum sodium (scatter plots, histograms and bar charts).
- Built a Logistic Regression baseline (70/30 split) and plotted its **ROC curve**.

**Part 2: Automated model comparison (PyCaret heart-disease dataset)**
- Used PyCaret's `setup` + `compare_models` to train and cross-validate **15 classifiers**
  (Naive Bayes, Logistic Regression, Ridge, LDA, QDA, KNN, SVM, Decision Tree, Random Forest,
  Extra Trees, AdaBoost, Gradient Boosting, XGBoost, LightGBM and a dummy baseline).
- Compared three preprocessing strategies:
  1. Outlier removal (5% threshold)
  2. **PCA** dimensionality reduction
  3. Outlier removal + **z-score normalisation**

### 6.4 Results

| Setup | Best model | Accuracy | AUC | F1 |
|---|---|---|---|---|
| Outlier removal | Naive Bayes | 82.5% | 0.882 | 0.803 |
| PCA | Ridge / LDA | 84.1% | 0.862 (LDA) | 0.806 |
| **Outlier removal + z-score** | **Naive Bayes** | **85.2%** | **0.879** | **0.825** |

Finding: simple, well-regularised models (Naive Bayes, LDA, Ridge, Logistic Regression)
outperformed complex boosting models on this small tabular dataset, and normalisation plus
outlier handling gave the biggest improvement.

### 6.5 Tech stack

Python, pandas, NumPy, Matplotlib, scikit-learn (Logistic Regression, ROC), PyCaret
(AutoML: setup, compare_models, PCA, normalisation, outlier removal), Google Colab.

### 6.6 What I learned

How much preprocessing choices matter on small medical datasets, how to read Kappa/MCC/AUC as
well as accuracy, and how AutoML tools speed up fair model comparison.

### 6.7 Resume bullet

- Compared 15 classifiers with PyCaret across outlier-removal, PCA and normalisation pipelines
  for heart-disease prediction. Best model: Naive Bayes, 85.2% accuracy and 0.88 AUC.

---

## 7. Retrogroove: Music Streaming Platform

### 7.1 Card fields

| Field | Value |
|---|---|
| `id` / slug | `retrogroove` |
| Title | Retrogroove |
| Tagline | A retro-themed music streaming app: upload, like and play songs |
| Blurb | Full-stack music platform where users sign up, upload songs with cover art, like tracks, search the library and stream through a persistent player, built with Next.js 13, TypeScript and Supabase. |
| Category | Full-Stack Web |
| Year | 2024 |
| Status | Deployed |
| Metric chips | `Auth + storage` · `Persistent player` · `Light/Dark mode` |
| Tags | Next.js, TypeScript, Tailwind CSS, Supabase, PostgreSQL, shadcn/ui, Zustand |
| GitHub | https://github.com/vishavmehra/Retrogroove |
| Live | https://retrogroove.vercel.app/ |
| Cover | `retrogroove.png` (from the personal-portfolio repo) |
| Featured | yes |

### 7.2 Overview

Retrogroove is a Spotify-style web app with a retro focus. Users can create an account, upload
their own tracks (audio + cover image), browse curated sections, search, like songs and listen
through a player that keeps playing while they navigate between pages.

### 7.3 Key features

- **Authentication** with Supabase Auth UI, and route protection through Next.js middleware.
- **Song upload**: a modal form (React Hook Form) that uploads audio and images to **Supabase
  Storage** with unique IDs, then writes metadata to **PostgreSQL**.
- **Curated home sections**: *Top Picks* and decade collections (**"70s Delights"**,
  **"80s Delights"**) that filter by release year and shuffle a fresh selection on each load.
- **Search** by title or author, with a debounced search input and URL query strings.
- **Liked Songs** page and a like button in the player.
- **Persistent audio player**: play/pause, next/previous, volume slider and progress bar, with
  global state in **Zustand** and playback through `use-sound`.
- **Account** page, loading skeletons and error boundaries on each route.
- **Light/Dark theme toggle** (next-themes), accessible components from **Radix UI / shadcn**,
  and toast notifications.

### 7.4 Tech stack

Next.js 13 (App Router, server actions for data fetching), React 18, TypeScript, Tailwind CSS,
shadcn/ui + Radix UI (dialog, dropdown, slider), Supabase (Auth, Postgres, Storage),
Zustand, React Hook Form, use-sound, react-hot-toast, react-icons, Vercel.

### 7.5 Architecture notes

- Data access lives in `actions/` (for example `getSongs`, `getSongsByTitle`,
  `getLikedSongs`, `getSongsByUserId`), which keeps pages thin.
- Custom hooks (`usePlayer`, `useLoadSongUrl`, `useLoadImage`, `useOnPlay`, `useDebounce`)
  wrap Supabase and player logic.
- Providers for Supabase session, user, modals, toasts and theme wrap the app layout.

### 7.6 What I learned

Building a real-time-feeling media app with server-side data fetching, managing global audio
state across routes, and using Supabase as a complete backend (auth, database and file storage).

### 7.7 Resume bullet

- Built and deployed a music streaming platform (Next.js 13, TypeScript, Supabase, Zustand)
  with authentication, song upload to cloud storage, likes, search and a persistent player.

---

## 8. Rentify: Property Rental & Booking Platform (`listing` repo)

### 8.1 Card fields

| Field | Value |
|---|---|
| `id` / slug | `rentify` |
| Title | Rentify |
| Tagline | An Airbnb-style marketplace to list properties and book stays |
| Blurb | Full-stack rental platform where hosts list properties through a 6-step wizard and guests search by location, dates and guests, pick a place on a map, and reserve it with automatic pricing. |
| Category | Full-Stack Web |
| Year | 2024 |
| Status | Deployed |
| Metric chips | `OAuth + credentials` · `Map + calendar` · `Reservations` |
| Tags | Next.js, TypeScript, Tailwind CSS, Prisma, MongoDB, NextAuth, Cloudinary |
| GitHub | https://github.com/vishavmehra/listing |
| Live | https://listing-byme.vercel.app/ |
| Cover | `listing.png` (from the personal-portfolio repo) |
| Featured | yes |

> Note: the package is named **rentify** and the repo is named **listing**. Use "Rentify" as
> the display title and keep the repo link as is. The database is **MongoDB** through Prisma
> (per `prisma/schema.prisma`), not PostgreSQL.

### 8.2 Key features

- **Authentication** with NextAuth: **Google OAuth** plus **email/password** (bcrypt-hashed),
  using the Prisma adapter.
- **Host a property**: a **6-step "Rent" wizard** (Category → Location → Info → Images →
  Description → Price) with country selection, an interactive **Leaflet map**, counters for
  guests/rooms/bathrooms, and **Cloudinary** image upload.
- **Browse & filter** by category (beach, countryside, etc.) and a **search modal** that filters
  by location, date range and guest/room counts through URL query strings.
- **Listing page** with image header, host info, amenities, map and a **reservation calendar**
  (react-date-range) that disables booked dates and calculates the **total price**
  automatically.
- **Trips** (my bookings), **Reservations** (bookings on my properties), **Favorites** (heart
  button) and **My Properties**, with cancel/delete actions.
- REST API routes for listings, reservations, favorites and registration.

### 8.3 Data model

`User` (profile, hashed password, favorite IDs) → `Account` (OAuth) → `Listing` (title,
description, image, category, rooms, bathrooms, guests, location, price) → `Reservation`
(start/end dates, total price), with cascading deletes.

### 8.4 Tech stack

Next.js 13 (App Router + API routes), React 18, TypeScript, Tailwind CSS, Prisma ORM, MongoDB,
NextAuth.js (Google + Credentials), bcrypt, Cloudinary (next-cloudinary), Leaflet /
react-leaflet, react-date-range, date-fns, world-countries, React Hook Form, Zustand, Axios,
react-hot-toast, Vercel.

### 8.5 What I learned

Relational data modelling with Prisma on MongoDB, OAuth and credentials auth together,
multi-step forms, map integration, and date-range availability logic.

### 8.6 Resume bullet

- Built an Airbnb-style booking platform (Next.js, Prisma/MongoDB, NextAuth, Cloudinary,
  Leaflet) with a 6-step hosting wizard, location/date/guest search, reservations with automatic
  pricing, favorites and trip management.

---

## 9. NexTalk: Real-Time Chat Application (MERN)

### 9.1 Card fields

| Field | Value |
|---|---|
| `id` / slug | `nextalk` |
| Title | NexTalk |
| Tagline | Real-time one-to-one and group chat with typing indicators |
| Blurb | MERN-stack messaging app with JWT authentication, Socket.io real-time messages, typing indicators, notifications, and group chats you can create, rename and manage. |
| Category | Full-Stack Web |
| Year | 2023 |
| Status | Completed |
| Metric chips | `Socket.io real-time` · `JWT auth` · `Group chats` |
| Tags | MongoDB, Express, React, Node.js, Socket.io, JWT, Chakra UI |
| GitHub | https://github.com/vishavmehra/NexTalk |
| Live | none |
| Featured | no |

### 9.2 Key features

- **Sign up / log in** with **JWT** tokens and **bcrypt** password hashing, and protected API
  routes through auth middleware.
- **User search** from a side drawer to start one-to-one chats.
- **Group chats**: create a group, rename it, add or remove members (admin-controlled).
- **Real-time messaging** with **Socket.io**: per-user rooms, per-chat rooms, and instant
  delivery to all participants.
- **Typing indicator** with a Lottie animation, and **notification badges** for messages in
  chats that aren't open.
- Profile modal, avatar badges and a scrollable chat feed.

### 9.3 Architecture

- **Backend:** Express REST API (`/api/user`, `/api/chat`, `/api/message`), Mongoose models
  (User, Chat, Message), centralised error middleware, and a Socket.io server on the same HTTP
  server.
- **Frontend:** React (Create React App), React Router, a Context API chat provider for global
  state, Chakra UI components, and an Axios client.

### 9.4 Tech stack

MongoDB, Mongoose, Express, Node.js, React, Socket.io (server + client), JSON Web Tokens,
bcrypt, Chakra UI, React Router, Axios, react-lottie, react-notification-badge.

### 9.5 What I learned

WebSocket event design (setup / join / typing / new message), JWT auth flows, and structuring a
full MERN monorepo.

### 9.6 Resume bullet

- Built a MERN real-time chat app with Socket.io, JWT auth, typing indicators, notifications and
  group-chat management.

---

## 10. Authors: Author & Post Manager

### 10.1 Card fields

| Field | Value |
|---|---|
| `id` / slug | `authors` |
| Title | Authors |
| Tagline | Create authors, publish posts, and manage everything with modals |
| Blurb | Next.js + TypeScript app with REST API routes for creating, listing and deleting authors and posts, modal-driven forms, validation, toasts and theme support. |
| Category | Full-Stack Web |
| Year | 2024 |
| Status | Deployed |
| Metric chips | `REST API routes` · `CRUD` · `Modal forms` |
| Tags | Next.js, TypeScript, Tailwind CSS, Zustand, React Hook Form |
| GitHub | https://github.com/vishavmehra/authors |
| Live | https://authors-eight.vercel.app/ |
| Cover | `authors.png` |
| Featured | no |

### 10.2 Key features

- **API routes** (`/api/authors`, `/api/posts`, `/api/posts/[id]`) supporting GET, POST and
  DELETE, with request validation and proper HTTP status codes.
- A lightweight **JSON file store** for persistence, generating IDs with `uuid`.
- **Modal-driven UI** (create user, create author, create post) managed with **Zustand** stores,
  with forms built in **React Hook Form**.
- Post and user cards showing author, body, views and reviews, plus toasts for success and error
  states.

### 10.3 Tech stack

Next.js (App Router pages + Pages API routes), TypeScript, Tailwind CSS, Zustand, React Hook
Form, uuid, next-themes, react-hot-toast, lucide-react, Vercel.

---

## 11. TravelMe: Travel Landing Page

### 11.1 Card fields

| Field | Value |
|---|---|
| `id` / slug | `travelme` |
| Title | TravelMe |
| Tagline | A responsive landing page for outdoor-travel enthusiasts |
| Blurb | Pixel-perfect, fully responsive travel and camping landing page with a hero, camp showcase, guide, feature and app-download sections, built with Next.js and Tailwind CSS. |
| Category | Frontend |
| Year | 2024 |
| Status | Deployed (learning project) |
| Metric chips | `Responsive` · `Next.js 13` · `Tailwind` |
| Tags | Next.js, TypeScript, Tailwind CSS |
| GitHub | https://github.com/vishavmehra/TravelMe |
| Live | https://travelme-sigma.vercel.app/ |
| Cover | `travelme.png` |
| Featured | no |

### 11.2 Details

Sections: hero with stats and ratings, horizontally scrolling **camp** cards, travel **guide**,
**features** grid over a patterned background, and a **get-the-app** call to action. Content
is data-driven from `constants/index.ts`, with reusable `Button` and `Camp` components and a
custom Tailwind theme (colours, background images, breakpoints). Built as a guided learning
exercise to practise responsive layout with Tailwind.

---

## 12. ReelAlchemy: Movie Search App

### 12.1 Card fields

| Field | Value |
|---|---|
| `id` / slug | `reelalchemy` |
| Title | ReelAlchemy |
| Tagline | Search any movie and see its details instantly |
| Blurb | React app that queries the OMDb API as you search, shows results as poster cards, and opens a detail panel with plot, cast, ratings and more. |
| Category | Frontend / React |
| Year | 2023 |
| Status | Completed |
| Metric chips | `OMDb API` · `Live search` · `styled-components` |
| Tags | React, JavaScript, Axios, styled-components, REST API |
| GitHub | https://github.com/vishavmehra/ReelAlchemy |
| Live | none |
| Featured | no |

### 12.2 Details

- Debounced search input that calls the **OMDb** search endpoint with Axios.
- A responsive grid of movie cards (poster, title, year, type).
- Clicking a card fetches full details by IMDb ID (rating, release date, runtime, genre,
  director, actors, plot) and shows them in an info panel with a close button.
- Styled entirely with **styled-components**, with a GitHub Pages deploy script.

---

## 13. ExpenseEase: Expense Tracker

### 13.1 Card fields

| Field | Value |
|---|---|
| `id` / slug | `expenseease` |
| Title | ExpenseEase |
| Tagline | Track income and expenses and always know your balance |
| Blurb | Lightweight React budgeting app: add income or expense transactions, see live totals and balance, and search your transaction history. |
| Category | Frontend / React |
| Year | 2023 |
| Status | Completed |
| Metric chips | `React Hooks` · `Live balance` · `Search` |
| Tags | React, JavaScript, styled-components, React Hooks |
| GitHub | https://github.com/vishavmehra/ExpenseEase |
| Live | none |
| Featured | no |

### 13.2 Details

- An **overview card** showing the current balance, with an add-transaction form (amount,
  description, income or expense).
- Totals for **income** and **expense** recalculated with `useEffect` whenever transactions
  change.
- A **transaction list** with colour-coded entries and a **search filter**.
- Built with functional components, `useState` / `useEffect` and styled-components, with a
  GitHub Pages deploy script.

---

## 14. TinDog: Responsive Landing Page

### 14.1 Card fields

| Field | Value |
|---|---|
| `id` / slug | `tindog` |
| Title | TinDog |
| Tagline | A playful, responsive startup landing page, "Tinder for dogs" |
| Blurb | Mobile-first marketing page built with HTML5, CSS3 and Bootstrap: hero, features, testimonials carousel, press logos, pricing tiers and call to action. |
| Category | Frontend / HTML-CSS |
| Year | 2023 |
| Status | Completed |
| Metric chips | `Bootstrap grid` · `Responsive` · `Pricing tables` |
| Tags | HTML5, CSS3, Bootstrap |
| GitHub | https://github.com/vishavmehra/TinDog |
| Live | none |
| Featured | no |

### 14.2 Details

Sections: hero ("Meet new and interesting dogs nearby.") with an app mock-up, three feature
highlights, testimonials, press logos (TechCrunch, TNW, Business Insider, Mashable), pricing
plans (Chihuahua / Labrador / Mastiff), CTA and footer. It was an early project to practise the
Bootstrap grid, components and responsive breakpoints.

---

## 15. Skills (derived from the projects above)

Group these into skill chips or a skills grid:

- **Languages:** Python, TypeScript, JavaScript, C, C++, Java, SQL, HTML, CSS
- **AI / ML:** PyTorch, TensorFlow / Keras, Hugging Face Transformers, PEFT / LoRA,
  scikit-learn, XGBoost, PyCaret, NLTK, spaCy, Librosa, OpenCV, dlib, Graph Neural Networks
- **GenAI / LLM:** Llama 3.2 fine-tuning, RAG, LangChain, Pinecone, AWS Bedrock (Titan
  Embeddings), prompt engineering
- **Frontend:** React, Next.js 13 (App Router, server actions), Tailwind CSS, shadcn/ui,
  Radix UI, Chakra UI, styled-components, Bootstrap, Framer Motion
- **Backend & data:** Node.js, Express, Socket.io, Prisma, MongoDB, PostgreSQL, Supabase,
  NextAuth, JWT, Cloudinary, Resend
- **Desktop / other:** PyQt5 / Qt Designer, Streamlit, serial / UART communication
- **Tools:** Git, GitHub, Vercel, Google Colab, Jupyter, Anaconda, VS Code, PyCharm

---

## 16. Ready-to-paste data file

Save as `lib/projects.ts` (or `data/projects.ts`) and import it into the carousel and the project
detail page. Adjust image paths to wherever the cover images are placed.

```ts
export type ProjectCategory =
  | "AI / NLP Research"
  | "Generative AI / LLM"
  | "AI / Speech & Audio ML"
  | "Computer Vision / Assistive Tech"
  | "Machine Learning / Healthcare"
  | "Full-Stack Web"
  | "Frontend"
  | "Frontend / React"
  | "Frontend / HTML-CSS";

export type ProjectGroup = "ai-ml" | "full-stack" | "frontend";

export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: ProjectCategory;
  group: ProjectGroup;
  year: number;
  status: string;
  metrics: string[];
  tags: string[];
  github: string;
  live?: string;
  image?: string;
  featured: boolean;
  highlights: string[];
}

export const projectsData: Project[] = [
  {
    id: "fake-news-detection",
    title: "Fake News Detection: Stacked Ensembles & Transformers",
    tagline: "20+ models, 5 datasets: from LSTMs to fine-tuned BERT ensembles",
    description:
      "Research-grade fake-news detection benchmarking deep learning, classic ML, a custom stacked ensemble and fine-tuned DistilBERT/BERT/RoBERTa across ISOT, LIAR, GossipCop, PolitiFact and a multilingual dataset.",
    category: "AI / NLP Research",
    group: "ai-ml",
    year: 2025,
    status: "Completed",
    metrics: ["99.76% ISOT accuracy", "76.5% LIAR (binary)", "5 datasets, 18 languages"],
    tags: ["Python", "PyTorch", "Transformers", "TensorFlow", "scikit-learn", "NLP"],
    github: "https://github.com/vishavmehra/Fake-news-detection-stacked-model-implementation",
    image: "/projects/fake-news.png",
    featured: true,
    highlights: [
      "Trained LSTM/GRU/CNN, 6 classic ML models and a Random-Forest stacked ensemble",
      "Fine-tuned DistilBERT, BERT and RoBERTa with speaker metadata on LIAR (76.5% binary, 44.8% 6-class)",
      "Built a claim–metadata Graph Convolutional Network and a hierarchical 6-class model",
      "Retrained on GossipCop (87.6%), PolitiFact (92.0%) and multilingual PolyglotFakeFacts (97.2%)",
      "Audited results for label leakage and source shortcuts",
    ],
  },
  {
    id: "medisense-ai",
    title: "MediSense AI",
    tagline: "A gynecology & pregnancy assistant powered by fine-tuned Llama 3.2 and RAG",
    description:
      "Domain-specific medical chatbot that combines a LoRA-fine-tuned Llama-3.2-1B with retrieval-augmented generation over Wikipedia and PDF knowledge stored in Pinecone, served through a Streamlit chat UI.",
    category: "Generative AI / LLM",
    group: "ai-ml",
    year: 2025,
    status: "Completed",
    metrics: ["Llama 3.2 · LoRA r=16", "RAG with Pinecone", "2 answer modes"],
    tags: ["Python", "PyTorch", "Hugging Face", "LoRA", "LangChain", "Pinecone", "Streamlit"],
    github: "https://github.com/vishavmehra/MediSense-Ai",
    image: "/projects/medisense.png",
    featured: true,
    highlights: [
      "LoRA fine-tuning (r=16, α=32) of Llama-3.2-1B on doctor–patient dialogues",
      "RAG pipeline: Wikipedia + PDF ingestion, 1,500-char chunks, UAE-Large-V1 / AWS Titan embeddings, Pinecone top-5 retrieval",
      "Streamlit chat app with Fine-Tune and RAG modes and response timing",
      "Topic modelling (TF-IDF + LSA) to profile the medical dialogue dataset",
    ],
  },
  {
    id: "grammar-scoring-engine",
    title: "AI Grammar Scoring Engine",
    tagline: "Scores spoken-English grammar (0–5) straight from raw audio",
    description:
      "Hybrid audio-ML pipeline that fuses Wav2Vec 2.0 speech embeddings with hand-crafted prosody features and a regularised XGBoost regressor to predict human grammar scores from 45–60 s voice recordings.",
    category: "AI / Speech & Audio ML",
    group: "ai-ml",
    year: 2025,
    status: "Completed",
    metrics: ["Pearson r = 0.47 (5-fold)", "RMSE 0.67", "774 features"],
    tags: ["Python", "PyTorch", "Wav2Vec 2.0", "Librosa", "XGBoost", "scikit-learn"],
    github: "https://github.com/vishavmehra/grammar-scoring-engine",
    image: "/projects/grammar-engine.png",
    featured: true,
    highlights: [
      "768-d mean-pooled Wav2Vec 2.0 embeddings + 6 prosodic features (pitch, energy, ZCR)",
      "Silence trimming, 16 kHz resampling and GPU-accelerated feature extraction",
      "Regularised XGBoost (1,500 trees, lr 0.005) validated with 5-fold CV",
      "Built for the SHL Research Intern assessment (409 train / 197 test recordings)",
    ],
  },
  {
    id: "eye-controlled-wheelchair",
    title: "Eye-Controlled Wheelchair",
    tagline: "Hands-free wheelchair control using only eye movements and a webcam",
    description:
      "Assistive computer-vision system that tracks the user's eye through facial landmarks, classifies gaze direction in real time with HOG features and a nearest-neighbour model, and sends movement commands to the wheelchair over serial.",
    category: "Computer Vision / Assistive Tech",
    group: "ai-ml",
    year: 2024,
    status: "Completed",
    metrics: ["5 commands", "Real-time webcam", "Per-user calibration"],
    tags: ["Python", "OpenCV", "dlib", "HOG", "scikit-learn", "PyQt5"],
    github: "https://github.com/vishavmehra/eye-controlled-wheelchair",
    image: "/projects/wheelchair.png",
    featured: true,
    highlights: [
      "Haar-cascade face detection + dlib 68-point landmarks to crop the eye region",
      "HOG features + 1-NN classifier for left / right / up / down / stop",
      "PyQt5 desktop app for dataset capture, training and live detection",
      "Serial (9600 baud) command output on a background QThread",
    ],
  },
  {
    id: "heart-attack-prediction",
    title: "Heart Attack Prediction Analysis",
    tagline: "EDA and AutoML model comparison for cardiac-risk prediction",
    description:
      "Exploratory and statistical analysis of heart-failure patient records, followed by an automated comparison of 15 classifiers with PyCaret under different preprocessing strategies. Best model: 85.2% accuracy.",
    category: "Machine Learning / Healthcare",
    group: "ai-ml",
    year: 2024,
    status: "Completed",
    metrics: ["85.2% accuracy", "15 models compared", "3 preprocessing setups"],
    tags: ["Python", "PyCaret", "scikit-learn", "pandas", "Matplotlib"],
    github: "https://github.com/vishavmehra/Heart-Attack-Prediction-Analysis",
    image: "/projects/heart.png",
    featured: true,
    highlights: [
      "EDA on 299 heart-failure patient records and a Logistic Regression ROC baseline",
      "PyCaret comparison of 15 classifiers with outlier removal, PCA and z-score normalisation",
      "Best: Naive Bayes, 85.2% accuracy, 0.88 AUC, 0.825 F1",
    ],
  },
  {
    id: "retrogroove",
    title: "Retrogroove",
    tagline: "A retro-themed music streaming app: upload, like and play songs",
    description:
      "Full-stack music platform where users sign up, upload songs with cover art, like tracks, search the library and stream through a persistent player, built with Next.js 13, TypeScript and Supabase.",
    category: "Full-Stack Web",
    group: "full-stack",
    year: 2024,
    status: "Deployed",
    metrics: ["Auth + storage", "Persistent player", "Light/Dark mode"],
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase", "PostgreSQL", "Zustand"],
    github: "https://github.com/vishavmehra/Retrogroove",
    live: "https://retrogroove.vercel.app/",
    image: "/projects/retrogroove.png",
    featured: true,
    highlights: [
      "Supabase Auth, Postgres and Storage for users, song metadata and audio/cover uploads",
      "Top Picks plus 70s/80s Delights sections filtered by release year",
      "Debounced search, Liked Songs and a Zustand-powered persistent player",
    ],
  },
  {
    id: "rentify",
    title: "Rentify",
    tagline: "An Airbnb-style marketplace to list properties and book stays",
    description:
      "Full-stack rental platform where hosts list properties through a 6-step wizard and guests search by location, dates and guests, pick a place on a map, and reserve it with automatic pricing.",
    category: "Full-Stack Web",
    group: "full-stack",
    year: 2024,
    status: "Deployed",
    metrics: ["OAuth + credentials", "Map + calendar", "Reservations"],
    tags: ["Next.js", "TypeScript", "Prisma", "MongoDB", "NextAuth", "Cloudinary"],
    github: "https://github.com/vishavmehra/listing",
    live: "https://listing-byme.vercel.app/",
    image: "/projects/listing.png",
    featured: true,
    highlights: [
      "NextAuth with Google OAuth and bcrypt email/password login",
      "6-step hosting wizard with Leaflet map and Cloudinary image upload",
      "Date-range reservations with automatic total price, trips, favorites and property management",
    ],
  },
  {
    id: "nextalk",
    title: "NexTalk",
    tagline: "Real-time one-to-one and group chat with typing indicators",
    description:
      "MERN-stack messaging app with JWT authentication, Socket.io real-time messages, typing indicators, notifications, and group chats you can create, rename and manage.",
    category: "Full-Stack Web",
    group: "full-stack",
    year: 2023,
    status: "Completed",
    metrics: ["Socket.io real-time", "JWT auth", "Group chats"],
    tags: ["MongoDB", "Express", "React", "Node.js", "Socket.io", "Chakra UI"],
    github: "https://github.com/vishavmehra/NexTalk",
    image: "/projects/nextalk.png",
    featured: false,
    highlights: [
      "Express REST API with Mongoose models and JWT-protected routes",
      "Socket.io rooms for instant delivery, typing indicators and notifications",
      "Group chat create / rename / add / remove",
    ],
  },
  {
    id: "authors",
    title: "Authors",
    tagline: "Create authors, publish posts, and manage everything with modals",
    description:
      "Next.js + TypeScript app with REST API routes for creating, listing and deleting authors and posts, modal-driven forms, validation, toasts and theme support.",
    category: "Full-Stack Web",
    group: "full-stack",
    year: 2024,
    status: "Deployed",
    metrics: ["REST API routes", "CRUD", "Modal forms"],
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Zustand", "React Hook Form"],
    github: "https://github.com/vishavmehra/authors",
    live: "https://authors-eight.vercel.app/",
    image: "/projects/authors.png",
    featured: false,
    highlights: [
      "GET/POST/DELETE API routes with validation and a JSON file store",
      "Zustand-managed modals with React Hook Form",
    ],
  },
  {
    id: "travelme",
    title: "TravelMe",
    tagline: "A responsive landing page for outdoor-travel enthusiasts",
    description:
      "Pixel-perfect, fully responsive travel and camping landing page with a hero, camp showcase, guide, feature and app-download sections, built with Next.js and Tailwind CSS.",
    category: "Frontend",
    group: "frontend",
    year: 2024,
    status: "Deployed",
    metrics: ["Responsive", "Next.js 13", "Tailwind"],
    tags: ["Next.js", "TypeScript", "Tailwind CSS"],
    github: "https://github.com/vishavmehra/TravelMe",
    live: "https://travelme-sigma.vercel.app/",
    image: "/projects/travelme.png",
    featured: false,
    highlights: ["Data-driven sections from a constants file", "Custom Tailwind theme and breakpoints"],
  },
  {
    id: "reelalchemy",
    title: "ReelAlchemy",
    tagline: "Search any movie and see its details instantly",
    description:
      "React app that queries the OMDb API as you search, shows results as poster cards, and opens a detail panel with plot, cast, ratings and more.",
    category: "Frontend / React",
    group: "frontend",
    year: 2023,
    status: "Completed",
    metrics: ["OMDb API", "Live search", "styled-components"],
    tags: ["React", "JavaScript", "Axios", "styled-components"],
    github: "https://github.com/vishavmehra/ReelAlchemy",
    image: "/projects/reelalchemy.png",
    featured: false,
    highlights: ["Debounced search against the OMDb API", "Detail panel fetched by IMDb ID"],
  },
  {
    id: "expenseease",
    title: "ExpenseEase",
    tagline: "Track income and expenses and always know your balance",
    description:
      "Lightweight React budgeting app: add income or expense transactions, see live totals and balance, and search your transaction history.",
    category: "Frontend / React",
    group: "frontend",
    year: 2023,
    status: "Completed",
    metrics: ["React Hooks", "Live balance", "Search"],
    tags: ["React", "JavaScript", "styled-components"],
    github: "https://github.com/vishavmehra/ExpenseEase",
    image: "/projects/expenseease.png",
    featured: false,
    highlights: ["Income/expense totals recalculated with useEffect", "Searchable transaction list"],
  },
  {
    id: "tindog",
    title: "TinDog",
    tagline: "A playful, responsive startup landing page, \"Tinder for dogs\"",
    description:
      "Mobile-first marketing page built with HTML5, CSS3 and Bootstrap: hero, features, testimonials carousel, press logos, pricing tiers and call to action.",
    category: "Frontend / HTML-CSS",
    group: "frontend",
    year: 2023,
    status: "Completed",
    metrics: ["Bootstrap grid", "Responsive", "Pricing tables"],
    tags: ["HTML5", "CSS3", "Bootstrap"],
    github: "https://github.com/vishavmehra/TinDog",
    image: "/projects/tindog.png",
    featured: false,
    highlights: ["Bootstrap grid, components and responsive breakpoints"],
  },
];

export const featuredProjects = projectsData.filter((p) => p.featured);

export const profile = {
  name: "Vishav Mehra",
  headline: "AI/ML Engineer & Full-Stack Developer",
  location: "New Delhi, India",
  email: "mehravishav26@gmail.com",
  links: {
    github: "https://github.com/vishavmehra",
    linkedin: "https://www.linkedin.com/in/vishav-mehra-755107208",
    leetcode: "https://leetcode.com/vishav__mehra",
    hackerrank: "https://www.hackerrank.com/mehravishav26",
    codeforces: "https://codeforces.com/profile/ThinkAgain",
    geeksforgeeks: "https://auth.geeksforgeeks.org/user/mehravishav26",
    codechef: "https://www.codechef.com/users/mehravishav26",
  },
} as const;

export const skillsData = {
  languages: ["Python", "TypeScript", "JavaScript", "C", "C++", "Java", "SQL", "HTML", "CSS"],
  aiMl: [
    "PyTorch", "TensorFlow / Keras", "Hugging Face Transformers", "PEFT / LoRA", "scikit-learn",
    "XGBoost", "PyCaret", "NLTK", "spaCy", "Librosa", "OpenCV", "dlib", "Graph Neural Networks",
  ],
  genAi: ["Llama 3.2 fine-tuning", "RAG", "LangChain", "Pinecone", "AWS Bedrock", "Prompt engineering"],
  frontend: [
    "React", "Next.js", "Tailwind CSS", "shadcn/ui", "Radix UI", "Chakra UI",
    "styled-components", "Bootstrap", "Framer Motion",
  ],
  backend: [
    "Node.js", "Express", "Socket.io", "Prisma", "MongoDB", "PostgreSQL", "Supabase",
    "NextAuth", "JWT", "Cloudinary", "Resend",
  ],
  tools: ["Git", "GitHub", "Vercel", "Google Colab", "Jupyter", "Streamlit", "PyQt5", "VS Code", "PyCharm"],
} as const;
```

---

## 17. Implementation checklist for the VS Code session

1. Create `lib/projects.ts` from section 16. If a project data file already exists, merge into
   it and keep existing field names where possible.
2. Copy cover images into `public/projects/`, using the filenames referenced in `image`. For
   projects without a screenshot, render a gradient + icon fallback when `image` is missing
   or fails to load.
3. Build or update the carousel card component to render: category · year, title, tagline,
   description, `metrics` as chips, `tags` as pills, and GitHub / Live / Details buttons.
   Only render Live when `live` exists.
4. Add category filter chips based on `group` (`ai-ml`, `full-stack`, `frontend`), defaulting
   to `featured`.
5. Build a project detail view (modal or `/projects/[id]`) that shows `highlights`. Take any
   longer copy from sections 2–14 of this document.
6. Keep accessibility in mind: carousel keyboard navigation, `aria-label`s on icon buttons,
   `alt` text on cover images (for example "Retrogroove music app screenshot"), and respect
   `prefers-reduced-motion` for carousel auto-play.
7. Before shipping, check that every `live` URL still loads. If one doesn't, remove `live` from
   that project.
8. Use the SEO descriptions and alt text from section 0.6 on detail pages and cover images. If
   the site has a "Journey" or "Experience" section, build it from the timeline in section 0.5.
9. Keep the total at **13 project cards**. Do not add the GitHub profile README or the old
   portfolio repository.
