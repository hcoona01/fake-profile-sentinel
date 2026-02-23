
import joblib
import numpy as np
import os
from typing import Dict

class TrustEngine:
    def __init__(self,
                 model_path: str = "api/ml/model.pkl",
                 scaler_path: str = "api/ml/scaler.pkl",
                 feature_names_path: str = "api/ml/feature_names.pkl"):

        self.model = joblib.load(model_path)
        self.scaler = joblib.load(scaler_path)
        self.feature_names = joblib.load(feature_names_path)

    def evaluate(self,
                 username: str,
                 follower_count: float,
                 following_count: float,
                 tweet_count: float,
                 account_age_days: float,
                 hashtags_per_tweet: float,
                 mentions_per_tweet: float,
                 avg_tweet_length: float,
                 contains_spam_words: int) -> Dict:

        reasons = []

        input_data = np.array([[
            follower_count,
            following_count,
            tweet_count,
            account_age_days,
            hashtags_per_tweet,
            mentions_per_tweet,
            avg_tweet_length,
            contains_spam_words
        ]])

        scaled_data = self.scaler.transform(input_data)
        bot_probability = self.model.predict_proba(scaled_data)[0][1]
        ml_trust_component = (1 - bot_probability) * 70

        rule_score = 30
        penalty = 0

        if account_age_days < 180:
            penalty += 5
            reasons.append("Very new account")

        if follower_count < 100:
            penalty += 5
            reasons.append("Low follower count")

        if following_count > 0:
            ratio = follower_count / following_count
            if ratio < 0.2:
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

        rule_trust_component = max(rule_score - penalty, 0)
        trust_score = ml_trust_component + rule_trust_component
        trust_score = max(0, min(100, round(trust_score, 2)))

        if trust_score >= 70:
            risk_level = "LOW"
        elif trust_score >= 40:
            risk_level = "MEDIUM"
        else:
            risk_level = "HIGH"

        if bot_probability > 0.7:
            reasons.append("ML model strongly predicts bot behavior")
        elif bot_probability > 0.4:
            reasons.append("ML model indicates moderate bot likelihood")
        else:
            reasons.append("ML model indicates human-like behavior")

        return {
            "username": username,
            "trust_score": trust_score,
            "risk_level": risk_level,
            "bot_probability": round(float(bot_probability), 4),
            "reasons": reasons
        }
