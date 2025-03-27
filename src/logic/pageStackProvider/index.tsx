'use client';
import React from 'react';

type PageStackProviderProps = {
    children: React.ReactNode;
};

type PageStackNode = {
    page: React.ReactNode;
    name: string;
}

const PageStackCTX = React.createContext<{
    addPage: (page: PageStackNode) => void;
    removePage: (name: string) => void;
}>({
    addPage: () => {},
    removePage: () => {},
});

const PageStackProvider: React.FC<PageStackProviderProps> = ({ children }) => {
    const [ stack, setStack ] = React.useState<PageStackNode[]>([]);

    const addPage = React.useCallback((page: PageStackNode) => 
        setStack((prevStack) => [ ...prevStack, page ])
    , []);

    const removePage = React.useCallback((name: string) =>
        setStack((prevStack) => prevStack.filter((page) => page.name !== name))
    , []);

    const contextValue = React.useMemo(() => ({ addPage, removePage }), [ addPage, removePage ]);

    return (
        <PageStackCTX.Provider value={ contextValue }>
            { stack.map(({ name, page }) => <React.Fragment key={ name }>{ page }</React.Fragment>) }
            { children }
        </PageStackCTX.Provider>
    );
};

const usePageStack = () => {
    const context = React.useContext(PageStackCTX);
    if (!context) throw new Error('usePageStack must be used within a PageStackProvider');
    return context;
};

export { usePageStack };
export default PageStackProvider;