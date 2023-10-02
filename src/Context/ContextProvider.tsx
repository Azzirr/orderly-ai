import { ReactNode, createContext } from "react";
import { useOrderAi } from "./useOrderAi";
import { CategoryData, ProductData, User } from "./types";

type OrderAiContextType = {
 isModalOpen: boolean;
 isLoading: boolean;
 currentModal: string;
 categories: CategoryData[] | null;
 jsonData: CategoryData[] | null;
 gptData: CategoryData[] | null;
 users: User[];
 loggedUserRole: string;
 loggedUserEmail: string;
 findCategoryId: (categoryName: string) => number;
 findFreeCategoryId: () => number;
 addCategory: (category: CategoryData) => void;
 editCategory: (category: CategoryData) => void;
 deleteCategory: (categoryId: number) => void;
 findFreeProductId: () => number;
 addProduct: (product: ProductData, categoryId: number) => void;
 editProduct: (product: ProductData, categoryId: number) => void;
 deleteProduct: (productId: number, categoryId: number) => void;
 changeModal: (element: string) => void;
 handleModalOpen: VoidFunction;
 handleModalClose: VoidFunction;
 handleToggleRoleChange: (id: number) => void;
 setUsers: (element: User[]) => void;
 setJsonData: (data: CategoryData[] | null) => void;
 setGptData: (data: CategoryData[] | null) => void;
 getEmbedYTLink: (link: string) => string;
 saveLoggedUserRole: (string: string) => void;
 saveLoggedUserEmail: (string: string) => void;
 clearLoggedUserRole: () => void;
 clearLoggedUserEmail: () => void;
};

type OrderAiContextProviderProps = {
 children: ReactNode;
};

export const OrderAiContext = createContext<OrderAiContextType>({
 isModalOpen: false,
 isLoading: false,
 currentModal: "none",
 categories: null,
 jsonData: null,
 gptData: null,
 users: [],
 loggedUserRole: "",
 loggedUserEmail: "",
 findCategoryId: () => 0,
 findFreeCategoryId: () => 0,
 addCategory: () => null,
 editCategory: () => null,
 deleteCategory: () => null,
 findFreeProductId: () => 0,
 addProduct: () => null,
 editProduct: () => null,
 deleteProduct: () => null,
 changeModal: () => null,
 handleModalOpen: () => null,
 handleModalClose: () => null,
 handleToggleRoleChange: () => {},
 setUsers: () => null,
 setJsonData: () => null,
 setGptData: () => null,
 getEmbedYTLink: () => "",
 saveLoggedUserRole: () => null,
 saveLoggedUserEmail: () => null,
 clearLoggedUserRole: () => null,
 clearLoggedUserEmail: () => null,
});

export const OrderAiContextProvider = ({ children }: OrderAiContextProviderProps) => {
 const value = useOrderAi();

 return <OrderAiContext.Provider value={value}>{children}</OrderAiContext.Provider>;
};
