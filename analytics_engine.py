import time
import random
from datetime import datetime, timedelta
import pandas as pd
from prophet import Prophet
import telebot

# --- 1. Ghost Resource & Downsizing Logic ---
def analyze_resource_utilization(resource_id, cpu_history, gpu_history=None):
    """
    Advanced Analytics: Flags resources for 'Downsizing' (Vertical Scaling) 
    if CPU and GPU utilization are consistently below 10% for a rolling 4-hour window.
    
    :param resource_id: Unique ID of the cloud resource
    :param cpu_history: List of (timestamp, cpu_percentage)
    :param gpu_history: List of (timestamp, gpu_percentage) - Optional
    :return: dict with status and recommended action
    """
    four_hours_ago = datetime.now() - timedelta(hours=4)
    
    # Filter metrics
    recent_cpu = [m for m in cpu_history if m[0] > four_hours_ago]
    recent_gpu = [m for m in gpu_history if m[0] > four_hours_ago] if gpu_history else []
    
    if not recent_cpu:
        return {"id": resource_id, "status": "INSUFFICIENT_DATA", "action": "NONE"}
    
    avg_cpu = sum(m[1] for m in recent_cpu) / len(recent_cpu)
    avg_gpu = sum(m[1] for m in recent_gpu) / len(recent_gpu) if recent_gpu else 0
    
    # Advanced Logic: Check if BOTH CPU and (if available) GPU are consistently low
    cpu_low = all(m[1] < 10 for m in recent_cpu)
    gpu_low = all(m[1] < 10 for m in recent_gpu) if recent_gpu else True
    
    if cpu_low and gpu_low:
        # Determine if it's a 'Ghost' (extremely low) or just 'Underutilized'
        is_ghost = all(m[1] < 2 for m in recent_cpu) and (all(m[1] < 2 for m in recent_gpu) if recent_gpu else True)
        
        return {
            "id": resource_id,
            "status": "GHOST_DETECTED" if is_ghost else "UNDERUTILIZED",
            "avg_cpu": round(avg_cpu, 2),
            "avg_gpu": round(avg_gpu, 2) if recent_gpu else "N/A",
            "action": "DOWNSIZE",
            "recommendation": "Vertical Scaling: Switch to a smaller instance class to optimize cost."
        }
    
    return {"id": resource_id, "status": "OPTIMAL", "avg_cpu": round(avg_cpu, 2), "action": "NONE"}

# --- 2. Interactive Telegram Alert ---
def setup_telegram_bot(api_token):
    """
    Sets up a Telegram bot that sends a warning before an Auto-Kill event.
    Allows the user to reply 'STAY' to cancel the shutdown.
    """
    bot = telebot.TeleBot(api_token)
    
    @bot.message_handler(func=lambda message: message.text.upper() == 'STAY')
    def handle_stay_request(message):
        chat_id = message.chat.id
        print(f"[TELEGRAM] User {chat_id} requested to STAY. Cancelling Auto-Kill.")
        bot.reply_to(message, "✅ Auto-Kill Cancelled. Resource will remain active for another 24h.")
        # Logic to update database/flag to prevent shutdown would go here
        
    return bot

def send_auto_kill_warning(bot, chat_id, resource_id):
    message = (
        f"⚠️ *SENTINEL-OPS WARNING*\n\n"
        f"Resource `{resource_id}` has been idle for > 4h.\n"
        f"Scheduled for *AUTO-KILL* in 15 minutes.\n\n"
        f"Reply *'STAY'* to cancel this action."
    )
    bot.send_message(chat_id, message, parse_mode='Markdown')

# --- 3. Sustainability Tracker ---
def calculate_sustainability_metrics(kwh_saved):
    """
    Converts Kilowatt-hours saved into CO2 offset metrics.
    Formula: 1 kWh = 0.4kg CO2
    """
    co2_offset = kwh_saved * 0.4
    return {
        "kwh_saved": kwh_saved,
        "co2_offset_kg": round(co2_offset, 2),
        "trees_equivalent": round(co2_offset / 21, 2) # 1 tree absorbs ~21kg CO2/year
    }

# --- 4. Anomaly-Based Budget Prediction ---
def predict_budget_exhaustion(daily_spend_history, budget_limit=100):
    """
    Uses Meta Prophet to predict the 'Date of Exhaustion' for a budget limit.
    
    :param daily_spend_history: List of (date_string, spend_amount)
    :param budget_limit: The credit limit (e.g., $100)
    :return: Predicted date of exhaustion
    """
    # Prepare data for Prophet
    df = pd.DataFrame(daily_spend_history, columns=['ds', 'y'])
    
    # Initialize and fit the model
    model = Prophet(daily_seasonality=True)
    model.fit(df)
    
    # Forecast future spend (next 60 days)
    future = model.make_future_dataframe(periods=60)
    forecast = model.predict(future)
    
    # Calculate cumulative spend
    forecast['cumulative_y'] = forecast['yhat'].cumsum()
    
    # Find where cumulative spend exceeds budget
    exhaustion_row = forecast[forecast['cumulative_y'] >= budget_limit].head(1)
    
    if not exhaustion_row.empty:
        exhaustion_date = exhaustion_row['ds'].iloc[0]
        return exhaustion_date.strftime('%Y-%m-%d')
    
    return "NO_EXHAUSTION_PREDICTED"

# --- Mock Data Generators ---
def generate_mock_utilization_data(resource_id):
    now = datetime.now()
    # Generate 4 hours of data (every 5 mins)
    cpu_data = [(now - timedelta(minutes=5*i), random.uniform(1, 8)) for i in range(48)]
    gpu_data = [(now - timedelta(minutes=5*i), random.uniform(0, 5)) for i in range(48)]
    return cpu_data, gpu_data

def generate_mock_spend_data():
    now = datetime.now()
    # Generate 30 days of spend data
    return [( (now - timedelta(days=i)).strftime('%Y-%m-%d'), random.uniform(2, 5) ) for i in range(30)]

# --- Main Execution Example ---
if __name__ == "__main__":
    print("--- Sentinel-Ops Analytics Engine Simulation ---")
    
    # 1. Downsizing Analysis
    mock_cpu, mock_gpu = generate_mock_utilization_data("i-0a1b2c3d")
    optimization = analyze_resource_utilization("i-0a1b2c3d", mock_cpu, mock_gpu)
    print(f"Optimization Analysis: {optimization}")
    
    # 2. Sustainability
    green_metrics = calculate_sustainability_metrics(150.5)
    print(f"Sustainability Metrics: {green_metrics}")
    
    # 3. Budget Prediction
    mock_spend = generate_mock_spend_data()
    exhaustion_date = predict_budget_exhaustion(mock_spend, budget_limit=100)
    print(f"Predicted Budget Exhaustion Date: {exhaustion_date}")
