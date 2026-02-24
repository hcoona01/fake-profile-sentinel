import { useState } from "react";

interface FormData {
  username: string;
  follower_count: string;
  following_count: string;
  tweet_count: string;
  account_age_days: string;
  hashtags_per_tweet: string;
  mentions_per_tweet: string;
  avg_tweet_length: string;
  contains_spam_words: string;
}

interface UploadFormProps {
  onResult: (result: any) => void;
  onLoading: (loading: boolean) => void;
}

export default function UploadForm({ onResult, onLoading }: UploadFormProps) {
  const [form, setForm] = useState<FormData>({
    username: "",
    follower_count: "",
    following_count: "",
    tweet_count: "",
    account_age_days: "",
    hashtags_per_tweet: "",
    mentions_per_tweet: "",
    avg_tweet_length: "",
    contains_spam_words: "0",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          follower_count: parseFloat(form.follower_count),
          following_count: parseFloat(form.following_count),
          tweet_count: parseFloat(form.tweet_count),
          account_age_days: parseFloat(form.account_age_days),
          hashtags_per_tweet: parseFloat(form.hashtags_per_tweet),
          mentions_per_tweet: parseFloat(form.mentions_per_tweet),
          avg_tweet_length: parseFloat(form.avg_tweet_length),
          contains_spam_words: parseInt(form.contains_spam_words),
        }),
      });
      const data = await response.json();
      onResult(data);
    } catch (err) {
      alert("Error connecting to API. Make sure backend is running.");
    }
    onLoading(false);
  };

  const fields = [
    { name: "follower_count", label: "Follower Count" },
    { name: "following_count", label: "Following Count" },
    { name: "tweet_count", label: "Tweet Count" },
    { name: "account_age_days", label: "Account Age (days)" },
    { name: "hashtags_per_tweet", label: "Hashtags Per Tweet" },
    { name: "mentions_per_tweet", label: "Mentions Per Tweet" },
    { name: "avg_tweet_length", label: "Avg Tweet Length" },
  ];

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto space-y-4">
      <div>
        <label className="text-gray-400 text-sm">Username</label>
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          required
          placeholder="e.g. crypto_earn123"
          className="w-full mt-1 bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {fields.map((field) => (
          <div key={field.name}>
            <label className="text-gray-400 text-sm">{field.label}</label>
            <input
              name={field.name}
              value={form[field.name as keyof FormData]}
              onChange={handleChange}
              required
              type="number"
              min="0"
              placeholder="0"
              className="w-full mt-1 bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        ))}

        <div>
          <label className="text-gray-400 text-sm">Contains Spam Words</label>
          <select
            name="contains_spam_words"
            value={form.contains_spam_words}
            onChange={handleChange}
            className="w-full mt-1 bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
          >
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all duration-200"
      >
        🔍 Analyze Profile
      </button>
    </form>
  );
}