import React from "react";

const ProductDescriptionBlock = ({
  description,
  userKeywords,
  showKeywordsInput,
  aiLoading,
  onChange,
  onGenerate,
}) => {
  return (
    <div className="md:col-span-2">
      <div className="flex justify-between items-center mb-2">
        <label className="block font-semibold text-gray-700 dark:text-gray-300">
          Product Description
        </label>

        {/* AI Generate Button */}
        <button
          type="button"
          onClick={onGenerate}
          disabled={aiLoading || !!description}
          className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium flex items-center gap-1"
          title="Auto-Generate with AI"
        >
          {aiLoading ? (
            <svg
              className="animate-spin h-4 w-4 text-blue-600 dark:text-blue-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : description ? (
            <>
              <span className="text-green-500">✅</span> Description Ready
            </>
          ) : (
            <>
              <span className="text-lg">⚙️</span> Use AI to Generate
            </>
          )}
        </button>
      </div>

      {showKeywordsInput && (
        <div className="mb-4">
          <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">
            Key Features / Keywords
          </label>
          <input
            type="text"
            name="userKeywords"
            value={userKeywords}
            onChange={onChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            placeholder="e.g., waterproof, strong grip, fast setting"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            🔑 Use commas to separate. These help AI write better copy!
          </p>
        </div>
      )}

      <textarea
        name="description"
        value={description}
        onChange={onChange}
        className="w-full border border-gray-300 px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        rows="4"
        placeholder={
          description
            ? ""
            : "Let AI handle it or type your own engaging description 🤖"
        }
        required
      ></textarea>

      {description && (
        <div className="text-right mt-2">
          <button
            type="button"
            className="text-sm text-blue-500 hover:underline"
            onClick={() => {
              navigator.clipboard.writeText(description);
              alert("📋 Copied to clipboard!");
            }}
          >
            📋 Copy Description
          </button>
        </div>
      )}

      {!description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">
          Pro Tip: AI writes best when product name + category + features are
          filled 💡
        </p>
      )}
    </div>
  );
};

export default ProductDescriptionBlock;
