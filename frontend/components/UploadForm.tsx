from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd
import os

app = Flask(__name__)

# Corrected CORS setup: It must come AFTER 'app' is defined
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Load models
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ML_DIR = os.path.join(BASE_DIR, "ml")

model = joblib.load(os.path.join(ML_DIR, "model.pkl"))
scaler = joblib.load(os.path.join(ML_DIR, "scaler.pkl"))
feature_names = joblib.load(os.path.join(ML_DIR, "feature_names.pkl"))

@app.route("/api/analyze", methods=["POST"])
def analyze():
    data = request.get_json()

    username = data.get("username", "unknown")
    follower_count = float(data.get("follower_count", 0))
    following_count = float(data.get("following_count", 0))
    tweet_count = float(data.get("tweet_count", 0))
    account_age_days = float(data.get("account_age_days", 0))
    hashtags_per_tweet = float(data.get("hashtags_per_tweet", 0))
    mentions_per_tweet = float(data.get("mentions_per_tweet", 0))
    avg_tweet_length = float(data.get("avg_tweet_length", 0))
    contains_spam_words = int(data.get("contains_spam_words", 0))

    reasons = []

    input_df = pd.DataFrame([[
        follower_count,
        following_count,
        tweet_count,
        account_age_days,
        hashtags_per_tweet,
        mentions_per_tweet,
        avg_tweet_length,
        contains_spam_words
    ]], columns=feature_names)

    scaled = scaler.transform(input_df)
    bot_prob = model.predict_proba(scaled)[0][1]
    ml_trust = (1 - bot_prob) * 70

    rule_score = 30
    penalty = 0

    if account_age_days < 180:
        penalty += 5
        reasons.append("Very new account")

    if follower_count < 100:
        penalty += 5
        reasons.append("Low follower count")

    if following_count > 0 and (follower_count / following_count) < 0.2:
        penalty += 4
        reasons.append("Suspicious follower-to-following ratio")

    if contains_spam_words == 1:
        penalty += 6
        reasons.append("Contains spam-related content")

    if hashtags_per_tweet > 5:
        penalty += 3
        reasons.append("Excessive hashtag usage")

    if mentions_per_tweet > 5:
        penalty += 3
        reasons.append("Excessive mention usage")

    if avg_tweet_length < 40:
        penalty += 2
        reasons.append("Very short average tweet length")

    rule_trust = max(rule_score - penalty, 0)
    trust_score = max(0, min(100, round(ml_trust + rule_trust, 2)))

    if trust_score >= 70:
        risk_level = "LOW"
    elif trust_score >= 40:
        risk_level = "MEDIUM"
    else:
        risk_level = "HIGH"

    if bot_prob > 0.7:
        reasons.append("ML model strongly predicts bot behavior")
    elif bot_prob > 0.4:
        reasons.append("ML model indicates moderate bot likelihood")
    else:
        reasons.append("ML model indicates human-like behavior")

    return jsonify({
        "username": username,
        "trust_score": trust_score,
        "risk_level": risk_level,
        "bot_probability": round(float(bot_prob), 4),
        "reasons": reasons
    })

if __name__ == "__main__":
    app.run(debug=True, port=5000)