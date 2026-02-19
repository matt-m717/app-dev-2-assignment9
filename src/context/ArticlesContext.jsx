import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const ArticlesContext = createContext();

export function ArticlesProvider({ children }) {
    const [savedArticles, setSavedArticles] = useState({});
    const { user } = useAuth();

    const saveArticle = article => {
        if (!user) return;

        setSavedArticles(prev => {
            const userArticles = prev[user.username] || [];
            // Check if article is already saved
            if (userArticles.find(a => a.url === article.url)) {
                return prev;
            }
            return {
                ...prev,
                [user.username]: [...userArticles, article]
            };
        });
    };

    const removeArticle = url => {
        if (!user) return;

        setSavedArticles(prev => {
            return {
                ...prev,
                [user.username]: (prev[user.username] || []).filter(
                    a => a.url !== url
                )
            };
        });
    };

    const isArticleSaved = url => {
        if (!user) return;

        const userArticles = savedArticles[user?.username] ?? [];
        return userArticles.some(a => a.url === url);
    };

    const getUserSavedArticles = () => {
        return savedArticles[user?.username] ?? [];
    };

    const getAllUserSavedArticles = () => {
        return savedArticles;
    };

    return (
        <ArticlesContext.Provider
            value={{
                saveArticle,
                removeArticle,
                isArticleSaved,
                getUserSavedArticles,
                getAllUserSavedArticles
            }}
        >
            {children}
        </ArticlesContext.Provider>
    );
}

export const useArticles = () => {
    const context = useContext(ArticlesContext);
    if (!context) {
        throw new Error("useArticles must be used within ArticlesProvider");
    }
    return context;
};
