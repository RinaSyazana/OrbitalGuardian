import os

# Toggle for Mock/Simulation mode to guarantee flawless demo
# Set MOCK_GRANITE=False and provide WATSONX_APIKEY to run live
MOCK_MODE = os.getenv("MOCK_GRANITE", "True").lower() in ["true", "1", "yes"]

# LangChain Granite template for generating narrative
narrative_template = """
You are an expert satellite flight dynamics AI named OrbitalGuardian powered by IBM Granite.
Given the following collision risk telemetry and SHAP explainability factors, write a concise 2-sentence operational narrative explaining the risk and why the recommended action was chosen.

Probability: {probability}%
Miss Distance: {miss_distance}m
Relative Velocity: {rel_velocity}km/s
Top SHAP Factors: {shap_factors}
Recommended Action: {action}

Narrative:
"""

def generate_narrative(satellite_data: dict) -> str:
    """
    Generates a human-readable narrative using IBM Granite via LangChain.
    Falls back to a highly realistic mock response if MOCK_MODE is enabled to prevent live API failures.
    """
    if MOCK_MODE:
        # Mock simulation mode for robust hackathon demo
        prob = satellite_data.get("probability", 0)
        action = satellite_data.get("action", "Monitor")
        
        if prob > 50:
            return f"Collision risk is elevated to {prob}% due to critically low miss distance. Immediate maneuver to '{action.lower()}' is strongly recommended to clear the conjunction corridor."
        elif prob > 20:
            return f"Risk is moderate at {prob}% due to covariance overlap within the screening volume. Recommendation is to '{action.lower()}' and await updated state vector."
        else:
            return f"Risk is very low at {prob}% with wide positional margins. '{action}' is sufficient at this time."

    # Production IBM Granite Integration (requires WATSONX_APIKEY in environment)
    try:
        from langchain.prompts import PromptTemplate
        from langchain_ibm import WatsonxLLM
        
        watsonx_llm = WatsonxLLM(
            model_id="ibm/granite-13b-chat-v2",
            url="https://us-south.ml.cloud.ibm.com",
            project_id=os.getenv("WATSONX_PROJECT_ID"),
            params={
                "decoding_method": "greedy",
                "max_new_tokens": 100,
                "min_new_tokens": 1,
            }
        )
        
        prompt = PromptTemplate(
            input_variables=["probability", "miss_distance", "rel_velocity", "shap_factors", "action"],
            template=narrative_template
        )
        
        shap_summary = ", ".join([f"{s['label']} ({s['value']})" for s in satellite_data.get("shap", [])[:3]])
        
        chain = prompt | watsonx_llm
        
        response = chain.invoke({
            "probability": satellite_data.get("probability"),
            "miss_distance": satellite_data.get("missDistanceM"),
            "rel_velocity": satellite_data.get("relativeVelocityKms"),
            "shap_factors": shap_summary,
            "action": satellite_data.get("action")
        })
        
        return response.strip()
    except Exception as e:
        print(f"IBM Granite API Error: {e}. Falling back to standard narrative.")
        return "Collision risk assessed. Action recommended based on top SHAP factors."
