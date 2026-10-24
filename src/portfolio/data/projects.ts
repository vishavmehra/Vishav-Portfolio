import type { ProjectEntry } from './types'

/**
 * Personal projects and research papers.
 *
 * The résumé lists these as two sections; they share a shape here and are told
 * apart by `category`, so a view can present them together or separately
 * without the data being duplicated.
 *
 * Link targets come from the PDF's URI annotations. Note that RetroGroove's
 * repository is named `VinylVibe` — that is what the résumé links to, so it is
 * what is recorded.
 */
export const PROJECTS: readonly ProjectEntry[] = [
  {
    id: 'retrogroove',
    title: 'RetroGroove',
    category: 'project',
    stack: ['TailWind', 'ReactJs', 'NextJs', 'TypeScript', 'Shadcn', 'Supabase', 'PostgreSQL'],
    points: [
      'Engineered a music platform, empowering users to upload, like, and listen to songs seamlessly.',
      'Implemented robust user authentication mechanisms using SupaBase and databases using PostgreSQL.',
      'Introduction of a system-wide dark mode utilizing advanced Shadcn and next-themes methodologies.',
    ],
    links: [
      { label: 'GitHub', href: 'https://github.com/vishavmehra/VinylVibe' },
      { label: 'Live', href: 'https://retrogroove.vercel.app/' },
    ],
  },
  {
    id: 'listing',
    title: 'Listing',
    category: 'project',
    stack: ['NextJs', 'Prisma', 'TailWind', 'TypeScript', 'PostgreSQL'],
    points: [
      'Developed an innovative hotel booking application, facilitating users to reserve accommodations or list properties.',
      'Introduced advanced filtering mechanisms, enabling users to search based on location or preferred destination.',
      'Utilised multi factor user authentication using Next Auth and managed database using Prisma ORM and PostgreSQL.',
    ],
    links: [
      { label: 'GitHub', href: 'https://github.com/vishavmehra/listing' },
      { label: 'Live', href: 'https://listing-byme.vercel.app/' },
    ],
  },
  {
    id: 'medisense-ai',
    title: 'MediSense-AI',
    category: 'project',
    stack: ['LLaMA', 'Python', 'Pinecone', 'Streamlit', 'LangChain', 'HuggingFace'],
    points: [
      'Built an end-to-end LLM-based RAG pipeline for the medical domain using fine-tuned LLaMA models, Wikipedia scraping, PDF ingestion, and topic modeling.',
      'Integrated Pinecone vector DB and embedding generation with HuggingFace models for semantic retrieval and question-answering in a Streamlit chatbot UI.',
      'Engineered modular utilities for text preprocessing, document embeddings, and inference APIs, enabling scalable and domain-specific language understanding.',
    ],
    links: [{ label: 'GitHub', href: 'https://github.com/vishavmehra/MediSense-Ai' }],
  },
  {
    id: 'eye-controlled-wheelchair',
    title: 'Eye Controlled Wheelchair',
    category: 'research',
    stack: ['OpenCV', 'Dlib', 'PyQt5', 'Imutils', 'Scikit-image', 'Scikit-learn'],
    points: [
      'Developed an eye-controlled wheelchair system using advanced eye-tracking technology to enhance navigation for users with motor impairments.',
      'Evaluated machine learning models (KNN, SVM, Random Forest, Decision Tree) for accuracy, precision, recall, and F1 score to optimize performance.',
      'Developed a front-end interface using Qt, enabling users to capture their own eye images for creating custom datasets.',
    ],
    links: [{ label: 'GitHub', href: 'https://github.com/vishavmehra/eye-controlled-wheelchair' }],
  },
  {
    id: 'heart-attack-prediction',
    title: 'Heart-Attack-Prediction-Analysis',
    category: 'research',
    stack: ['PyCaret', 'Pandas', 'NumPy', 'Matplotlib', 'Scikit-Learn', 'Google Colab'],
    points: [
      'Built a machine learning pipeline to predict heart attack risk using clinical data, automated with PyCaret.',
      'Performed EDA and feature analysis to identify key health indicators impacting prediction outcomes.',
      'Benchmarked multiple models and achieved high accuracy using Logistic Regression and Extra Trees.',
    ],
    links: [{ label: 'GitHub', href: 'https://github.com/vishavmehra/Heart-Attack-Prediction-Analysis' }],
  },
  {
    id: 'cross-domain-fake-news',
    title: 'Cross-Domain Fake News Detection',
    category: 'research',
    stack: ['PyTorch', 'BERT', 'RoBERTa', 'DistilBERT', 'Transformers', 'Scikit-learn'],
    points: [
      'Developed a transformer-driven fake news detection framework by fine-tuning DistilBERT, BERT, and RoBERTa and combining predictions through voting, probability averaging, validation-weighted fusion, threshold tuning, and stacked meta-classification.',
      'Improved LIAR binary classification from 71.03% to 80.42% and achieved a best verified 45.91% accuracy on six-class truthfulness classification using transformer-based ensemble strategies.',
      'Designed a hierarchical binary-to-multi-class classification approach and explored metadata graph modelling using speaker, subject, party, and context information while controlling for potential metadata leakage.',
      'Validated cross-domain and multilingual robustness on Politifact, GossipCop, and PolyglotFakeFacts, achieving 91.95%, 87.62%, and 99.61% accuracy, respectively, using primary non-diagnostic methods.',
    ],
    links: [{ label: 'GitHub', href: 'https://github.com/vishavmehra/Fake-news-detection-stacked-model-implementation' }],
  },
  {
    id: 'quantum-circuit-routing',
    title: 'Reinforcement Learning-Based Quantum Circuit Routing Optimization',
    category: 'research',
    stack: ['Python', 'RL', 'GNN', 'Transformer'],
    points: [
      'Developed a reinforcement learning-based quantum circuit routing framework to minimize SWAP-gate overhead under hardware connectivity constraints.',
      'Implemented and compared GNN and Transformer-based neural architectures for learning routing policies using REINFORCE, action masking, reward shaping, and curriculum-based training.',
      'Built a reproducible benchmarking framework across 139 quantum circuits, comparing neural and heuristic routing methods; the GNN model achieved 2.3× faster training than the Transformer.',
    ],
    // The résumé prints no link for this one.
  },
] as const
