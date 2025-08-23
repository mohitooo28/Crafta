"use client";

import Header from "@/components/custom/Header";
import HoverSidebar from "@/components/custom/HoverSidebar";
import { UserDetailContext } from "@/context/UserDetailContext";
import Lookup from "@/data/Lookup";
import React, { useContext } from "react";
import { Mail, Github, Video, BookOpen } from "lucide-react";

function Help() {
  const { userDetails } = useContext(UserDetailContext);

  const iconMap = {
    email: Mail,
    github: Github,
    demo: Video,
  };

  const handleHelpAction = (option) => {
    if (option.type === "email") {
      window.location.href = `mailto:${option.link}?subject=Crafta Demo - Help Request`;
    } else if (option.type === "external") {
      window.open(option.link, "_blank", "noopener noreferrer");
    }
  };

  return (
    <div className="bg-background text-white min-h-screen antialiased">
      <Header />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-15">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            <span className="bg-gradient-to-r from-primary bg-custom-blue text-transparent bg-clip-text">
              Get Help
            </span>{" "}
            & Support
          </h1>
          <p className="text-lg text-gray-400">{Lookup.HELP_DESC}</p>
        </div>

        <div className="max-w-4xl mx-auto mt-20">
          <div className="bg-chat-background/40 border border-gray-700 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              🚀 About Crafta
            </h2>
            <p className="text-gray-400 mb-4">
              Crafta is an AI-powered website builder that transforms ideas into
              live, editable sites in seconds. Built with cutting-edge
              technologies to deliver lightning-fast Next.js performance.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mt-16 items-center">
          {Lookup.HELP_OPTIONS.map((option, index) => {
            const IconComponent = iconMap[option.icon] || BookOpen;
            const isHighlighted = option.name === "GitHub";

            return (
              <div
                key={option.name}
                className={`p-8 rounded-xl border flex flex-col h-full transition-all duration-300 transform hover:-translate-y-2 cursor-pointer ${
                  isHighlighted
                    ? "bg-chat-background/80 border-2 border-primary shadow-2xl shadow-primary/10"
                    : "bg-chat-background/40 border-gray-700 hover:border-primary/50"
                }`}
                onClick={() => handleHelpAction(option)}
              >
                {isHighlighted && (
                  <div className="text-center -mt-12 mb-6">
                    <span className="inline-block bg-primary text-gray-900 text-sm font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                      Open Source
                    </span>
                  </div>
                )}

                <div className="flex-grow">
                  <div className="flex items-center mb-4">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${
                        isHighlighted ? "bg-primary/20" : "bg-gray-700"
                      }`}
                    >
                      <IconComponent
                        className={`w-6 h-6 ${
                          isHighlighted ? "text-primary" : "text-gray-300"
                        }`}
                      />
                    </div>
                    <h3 className="text-2xl font-bold text-white">
                      {option.name}
                    </h3>
                  </div>

                  <p className="text-gray-400 mb-6">{option.desc}</p>
                </div>

                <button
                  className={`w-full py-3 font-bold rounded-lg text-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary/50 ${
                    isHighlighted
                      ? "bg-primary text-gray-900 hover:bg-primary/90"
                      : "bg-gray-700 text-white hover:bg-primary hover:text-gray-900"
                  }`}
                >
                  {option.buttonText}
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <HoverSidebar />
    </div>
  );
}

export default Help;
