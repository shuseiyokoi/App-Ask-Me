

# 🧠 Ask Me — RAG-Powered Career Chatbot

**Ask Me** is a Retrieval-Augmented Generation (RAG) chatbot designed to answer questions about my professional experience using Large Language Models (LLMs) enhanced with domain-specific knowledge.

💼 Instead of scrolling through my resume or website, recruiters and collaborators can interact with this chatbot to ask questions like:
- "What AI projects has Shu worked on?"
- "Does he have experience with time series forecasting?"

The app responds with personalized, accurate answers — powered by LLMs, Amazon Bedrock, and a structured knowledge base in S3.

🔗 **Live Demo**: [Ask Me App](https://main.d1tdd63qxtj4xh.amplifyapp.com/)  
📝 **Blog**: [LLM RAG Chatbot: Ask Me — Full Technical Breakdown](https://www.notion.so/shuseiyokoi/LLM-RAG-ChatBot-Ask-Me-1adf61fbe85c805cb7a1fb0904318c4b)

<img width="748" height="628" alt="sample" src="https://github.com/user-attachments/assets/41cb704d-c9b0-4cbd-9208-c85d5f8f7354" />

---

## 📐 System Architecture

<img width="3328" height="1632" alt="image (6)" src="https://github.com/user-attachments/assets/4f0facb1-ec46-4117-a731-2eb2ba864c11" />


- **Frontend**: Built with **React**, deployed via **AWS Amplify**
- **RAG Backend**:
  - **Amazon Bedrock Agent** handles query processing and response generation
  - **Amazon Kendra** retrieves context from documents in **Amazon S3**
- **Serverless Functions**:
  - `AskMe Function`: Handles user input and AI responses
  - `Logging Function`: Stores chat logs for future analysis
- **Monitoring (Optional)**: Amazon CloudWatch + SNS for alerting

---

## 🧠 LLM + RAG Pipeline

### Why RAG?
LLMs like GPT or Claude are powerful, but can hallucinate or miss domain-specific context. RAG solves this by injecting real knowledge — in this case, a structured version of my career history.

### Key Components
- **Amazon Kendra** indexes documents from S3 (resume, projects, certs)
- **Amazon Bedrock Agent** (using **Anthropic’s Claude or Amazon Titan**) handles QA over that content
- **Structured JSON documents** allow precise retrieval and context injection

---

## 🗂️ Example S3 Document (Certifications)

```json
{
  "title": "CompTIA Data+",
  "issuer": "CompTIA",
  "issue_date": "December 16, 2023",
  "skills": [
    "Data Analysis", "Data Visualization", "Data Governance"
  ],
  "url": "https://www.credly.com/badges/7e3c6a83-954e-4d91-9a70-09604eb981e3"
}
````

---

## 📦 Tech Stack

| Layer           | Tech Used                            |
| --------------- | ------------------------------------ |
| LLM / Reasoning | Amazon Bedrock Agent (Nova Pro) |
| Retrieval       | Amazon Kendra                        |
| Knowledge Base  | Amazon S3 (JSON structured docs)     |
| UI              | React + AWS Amplify                  |
| Monitoring      | CloudWatch + SNS (optional)          |
| Logging         | AWS Lambda + S3                      |

---

## 📈 Use Case

This chatbot was built to help:

* Recruiters quickly understand my background
* Clients verify my project experience
* Showcase how RAG can make LLMs *useful in real-world settings*

---

## 🚀 Try It Out

👉 [Launch the Chatbot](https://main.d1tdd63qxtj4xh.amplifyapp.com/)

No sign-up required. Ask about projects, certs, or skills — and get instant answers.

---

## 📖 Learn More

📝 [Full Blog with Diagrams, Setup & Code](https://www.notion.so/shuseiyokoi/LLM-RAG-ChatBot-Ask-Me-1adf61fbe85c805cb7a1fb0904318c4b)

---

## 🛠️ Future Work

* Add vector-based semantic search for multi-turn reasoning
* Improve summarization and answer ranking
* Open-source version with Hugging Face + LangChain

---

## 📄 License

MIT License © 2025 [@shuseiyokoi](https://github.com/shuseiyokoi)


---

Let me know if you want this version with an English-Japanese toggle or add deployment instructions (Amplify + Bedrock Agent setup).

