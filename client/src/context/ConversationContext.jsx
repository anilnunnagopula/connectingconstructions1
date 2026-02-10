import React, { createContext, useState, useContext, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const ConversationContext = createContext(null);

export const ConversationProvider = ({ children }) => {
    const [sessionId, setSessionId] = useState('');
    const [turnHistory, setTurnHistory] = useState([]); // Array of { role: 'user'|'system', text: '', timestamp: '' }
    const [context, setContext] = useState({
        lastIntent: null,
        lastEntity: null, // e.g. { type: 'product', value: 'cement' }
        activeRoute: null
    });

    // Initialize session on mount
    useEffect(() => {
        let sid = sessionStorage.getItem('voice_session_id');
        if (!sid) {
            sid = uuidv4();
            sessionStorage.setItem('voice_session_id', sid);
        }
        setSessionId(sid);
    }, []);

    const addTurn = (role, text) => {
        setTurnHistory(prev => [...prev, { role, text, timestamp: new Date().toISOString() }]);
    };

    const updateContext = (newContext) => {
        setContext(prev => ({ ...prev, ...newContext }));
    };

    const resetContext = () => {
        setContext({
            lastIntent: null,
            lastEntity: null,
            activeRoute: null
        });
    };

    const value = {
        sessionId,
        turnHistory,
        context,
        addTurn,
        updateContext,
        resetContext
    };

    return (
        <ConversationContext.Provider value={value}>
            {children}
        </ConversationContext.Provider>
    );
};

export const useConversation = () => {
    const context = useContext(ConversationContext);
    if (!context) {
        throw new Error("useConversation must be used within a ConversationProvider");
    }
    return context;
};
