import time
import sys
import os
import dotenv
from langchain_core.messages import SystemMessage, HumanMessage
from langchain_core.runnables import RunnableConfig
from langchain_mistralai import ChatMistralAI
from tools.utility import tools
from utils.utils import AgentState

dotenv.load_dotenv()


class Agent:
    def __init__(self):
        self.mistral_model = ChatMistralAI(
            model="mistral-large-latest",
            temperature=0,
            api_key=os.getenv("MISTRAL_API_KEY")
        )

        Tool = tools()
        self.tools = Tool.toolkit()
        self.model_with_tool = self.mistral_model.bind_tools(self.tools)

    def system_prompt(self) -> SystemMessage:
        """System prompt for the Helix Invoice Intelligence & Underwriting Agent."""
        return SystemMessage(
            content=(
                "You are Energetic Goose AI Assistent, an intelligent financial operations and underwriting assistant.\n\n"
                "Your mission includes detecting, interpreting, and underwriting invoices in real time.\n"
                "When underwriting, evaluate:\n"
                "  • Invoice authenticity (dates, issuer–buyer consistency, duplicates)\n"
                "  • Vendor and buyer credit risk (payment history, financial ratios, defaults)\n"
                "  • Alternative signals such as web presence, customer reviews, and social-media sentiment\n"
                "  • Invoice aging, tenor, and concentration risk\n"
                "  • Macroeconomic or sector conditions that may affect repayment probability\n\n"
                "After analysis, return a concise JSON structure with your decision:\n"
                "{\n"
                "  'invoice_id': str,\n"
                "  'validity_score': float,          # 0–1 confidence the invoice is authentic\n"
                "  'vendor_risk': str,               # Low / Medium / High\n"
                "  'buyer_risk': str,                # Low / Medium / High\n"
                "  'recommended_LTV': float,         # Suggested loan-to-value %\n"
                "  'expected_yield': float,          # Target APR for this risk profile\n"
                "  'confidence': float,              # Overall model confidence 0–1\n"
                "  'reasoning': str                  # Clear explanation in one paragraph\n"
                "}\n\n"
                "Maintain compliance, accuracy, and traceability at all times:\n"
                "- Never invent financial data or unverifiable company details.\n"
                "- Ask for minimal clarification if key invoice or company info is missing.\n"
                "- Keep reasoning factual and auditable.\n"
                "- Preserve a professional, analytical tone suitable for financial decision-making.\n\n"
                "You may later interface with external systems such as Centrifuge (for tokenization) "
                "or LendAPI (for origination) by outputting clear, structured instructions, "
                "but you never execute blockchain or payment actions directly."
            )
        )

    def run_agent(self, state: AgentState, config: RunnableConfig) -> dict:
        """Runs the Helix Agent on the provided state and configuration."""
        time.sleep(3)

        response = self.model_with_tool.invoke(
            [self.system_prompt()] + state["messages"],
            config
        )

        return {"messages": [response]}
