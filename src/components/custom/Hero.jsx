"use client";
import { MessagesContext } from "@/context/MessagesContext";
import Lookup from "@/data/Lookup";
import { ArrowRight, Clipboard, X } from "lucide-react";
import React, { useContext, useState } from "react";

function Hero() {
  const [userInput, setUserInput] = useState("");
  const { messages, setMessages } = useContext(MessagesContext);

  const onGenerate = () => {
    if (userInput.trim()) {
      setMessages({
        role: "user",
        content: userInput,
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      onGenerate();
    }
  };

  const handleClipboardPaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUserInput(text);
    } catch (err) {
      console.error("Failed to read clipboard contents: ", err);
    }
  };

  const handleClearInput = () => {
    setUserInput("");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] px-4 sm:px-6 lg:px-8">
      <div className="text-center space-y-6 max-w-4xl mx-auto">
        <div className="space-y-1">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight px-2">
            {(() => {
              const words = Lookup.HERO_HEADING.split(" ");
              return (
                <>
                  <span className="text-primary">{words[0]}</span>{" "}
                  {words.slice(1).join(" ")}
                </>
              );
            })()}
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {Lookup.HERO_DESC}
          </p>
        </div>

        <div className="w-full max-w-3xl mx-auto mt-10">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-custom-blue/20 to-primary/20 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
            <div className="relative bg-black/30 backdrop-blur-md rounded-xl p-4 sm:p-6 shadow-2xl hover:shadow-3xl hover:bg-black/20 transition-all duration-300 border border-white/10 hover:border-white/20">
              <textarea
                placeholder={Lookup.INPUT_PLACEHOLDER}
                value={userInput}
                className="w-full h-32 sm:h-40 resize-none bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-base sm:text-lg leading-relaxed scrollbar-thin"
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={handleKeyPress}
              />

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                <div className="hidden lg:block text-xs sm:text-sm text-muted-foreground">
                  Press{" "}
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl</kbd>{" "}
                  +{" "}
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">
                    Enter
                  </kbd>{" "}
                  to generate
                </div>

                <div className="flex items-center gap-2 lg:ml-auto">
                  {userInput.trim() ? (
                    <button
                      onClick={handleClearInput}
                      className="inline-flex items-center justify-center w-9 h-9 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg transition-all duration-200 hover:shadow-md group"
                      title="Clear input"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleClipboardPaste}
                      className="inline-flex items-center justify-center w-9 h-9 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg transition-all duration-200 hover:shadow-md group"
                      title="Paste from clipboard"
                    >
                      <Clipboard className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={onGenerate}
                    disabled={!userInput.trim()}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-custom-blue hover:bg-custom-blue/90 disabled:bg-muted disabled:text-muted-foreground text-white rounded-lg font-medium transition-all duration-200 hover:shadow-md disabled:cursor-not-allowed group"
                  >
                    Generate
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-4xl mx-auto">
          <p className="text-sm text-muted-foreground mb-4">
            Try these examples:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {Lookup.SUGGESTIONS.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setUserInput(suggestion)}
                className={`px-3 py-2 text-xs sm:text-sm bg-card border border-border/50 rounded-full hover:bg-accent hover:border-border transition-all duration-200 text-foreground/80 hover:text-foreground whitespace-nowrap ${
                  index > 3 ? "hidden sm:inline-block" : ""
                }`}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
