/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';

const TagContext = createContext();

export const useTags = () => useContext(TagContext);

export const TagProvider = ({ children }) => {
    const [tags, setTags] = useState(() => {
        if (!window.electronAPI) {
            return [
                { id: 'tag-1', label: 'Vacation', icon: '🏖️', color: '#ff9800' },
                { id: 'tag-2', label: 'Business', icon: '💼', color: '#4caf50' },
                { id: 'tag-3', label: 'Nature', icon: '🏔️', color: '#2e7d32' }
            ];
        }
        return [];
    });

    useEffect(() => {
        if (window.electronAPI) {
            window.electronAPI.getTags().then(dbTags => {
                if (dbTags && dbTags.length > 0) {
                    setTags(dbTags);
                }
            });
        }
    }, []);

    const saveTags = (newTags) => {
        setTags(newTags);
        if (window.electronAPI) {
            window.electronAPI.saveTags(newTags);
        }
    };

    const addTag = (newTag) => {
        const updated = [...tags, { ...newTag, id: `tag-${Date.now()}` }];
        saveTags(updated);
    };

    const deleteTag = (id) => {
        saveTags(tags.filter(t => t.id !== id));
    };

    return (
        <TagContext.Provider value={{ tags, addTag, deleteTag, saveTags }}>
            {children}
        </TagContext.Provider>
    );
};
