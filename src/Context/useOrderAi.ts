import { useContext, useEffect, useState } from "react";
import { OrderAiContext } from "./ContextProvider";
import { CategoryData, ProductData, User } from "./types";
import { toggleRole } from "./utils";
import useDecrypt from "../Hooks/useDecrypt";
import { categoriesPath, usersPath } from "./paths";
export const useOrderAi = () => {
 const [isModalOpen, setIsModalOpen] = useState(false);
 const [isLoading, setIsLoading] = useState(false);
 const [currentModal, setCurrentModal] = useState("none");
 const [categories, setCategories] = useState<CategoryData[]>([]);
 const [jsonData, setJsonData] = useState<CategoryData[] | null>(null);
 const [gptData, setGptData] = useState<CategoryData[] | null>(null);
 const [users, setUsers] = useState<User[]>([]);
 const [loggedUserRole, setLoggedUserRole] = useState("");
 const [loggedUserEmail, setLoggedUserEmail] = useState("");
 const { parseJwtToken } = useDecrypt();
 const dataToUse = gptData || jsonData || categories || [];

 useEffect(() => {
  const token = parseJwtToken();
  if (!token) {
   return;
  }
  setLoggedUserEmail(token.email);
  setLoggedUserRole(token.role);
 }, []);

 useEffect(() => {
  fetch(categoriesPath)
   .then((response) => response.json())
   .then((data) => {
    setCategories(data);
   })
   .catch((error) => {
    console.error("Error fetching JSON data:", error);
   });
 }, []);

 useEffect(() => {
  fetch(usersPath)
   .then((response) => response.json())
   .then((data) => {
    setUsers(data.users);
   })
   .catch((error) => {
    console.error("Error fetching JSON data:", error);
   });
 }, []);

 const findCategoryId = (categoryName: string): number => {
  if (!dataToUse) return 0;
  return dataToUse.find((category) => category.name === categoryName)?.id || 0;
 };

 const findFreeCategoryId = (): number => {
  if (!dataToUse) return 0;

  let randomId: number = 0;
  do {
   randomId = Math.floor(Math.random() * 1000000);
  } while (dataToUse.some((category) => category.id === randomId));
  return randomId;
 };

 const addCategory = (category: CategoryData) => {
  if (gptData !== null) {
   const updatedGptData: CategoryData[] = [...gptData, category];
   setGptData(updatedGptData);
  } else if (jsonData !== null) {
   const updatedJsonData: CategoryData[] = [...jsonData, category];
   setJsonData(updatedJsonData);
  } else {
   const updatedCategories: CategoryData[] = [...categories, category];
   setCategories(updatedCategories);
  }
 };

 const editCategory = (category: CategoryData) => {
  if (dataToUse !== null) {
   const targetCategory = dataToUse.find((c) => c.id === category.id);

   if (targetCategory) {
    if (gptData !== null) {
     const updatedGptData = gptData.map((c) => (c.id === category.id ? category : c));
     setGptData(updatedGptData);
    } else if (jsonData !== null) {
     const updatedJsonData = jsonData.map((c) => (c.id === category.id ? category : c));
     setJsonData(updatedJsonData);
    } else {
     const updatedCategories = categories.map((c) => (c.id === category.id ? category : c));
     setCategories(updatedCategories);
    }
   } else {
    console.error(`Category with ID ${category.id} not found.`);
   }
  } else {
   console.error("No data source available to edit the category.");
  }
 };

 const deleteCategory = (categoryId: number) => {
  if (dataToUse !== null) {
   const targetCategory = dataToUse.find((c) => c.id === categoryId);
   if (targetCategory) {
    if (gptData !== null) {
     const updatedGptData = gptData.filter((c) => c.id !== categoryId);
     setGptData(updatedGptData);
    } else if (jsonData !== null) {
     const updatedJsonData = jsonData.filter((c) => c.id !== categoryId);
     setJsonData(updatedJsonData);
    } else {
     const updatedCategories = categories.filter((c) => c.id !== categoryId);
     setCategories(updatedCategories);
    }
   } else {
    console.error(`Category with ID ${categoryId} not found.`);
   }
  } else {
   console.error("No data source available to delete the category.");
  }
 };

 const findFreeProductId = (): number => {
  if (!dataToUse) return 0;

  let randomId: number;
  do {
   randomId = Math.floor(Math.random() * 1000000);
  } while (dataToUse.some((category) => category.id === randomId));

  return randomId;
 };

 const addProduct = (product: ProductData, categoryId: number) => {
  if (dataToUse) {
   const targetCategory = dataToUse.find((category) => category.id === categoryId);
   if (targetCategory) {
    const updatedCategory: CategoryData = {
     ...targetCategory,
     products: [...targetCategory.products, product],
    };

    if (gptData) {
     const updatedGptData = gptData.map((category) => (category.id === categoryId ? updatedCategory : category));
     setGptData(updatedGptData);
    } else if (jsonData) {
     const updatedJsonData = jsonData.map((category) => (category.id === categoryId ? updatedCategory : category));
     setJsonData(updatedJsonData);
    } else if (categories) {
     const updatedCategories = categories.map((category) => (category.id === categoryId ? updatedCategory : category));
     setCategories(updatedCategories);
    }
   } else {
    console.error(`Category with ID ${categoryId} not found.`);
   }
  } else {
   console.error("No data source available to add the product.");
  }
 };

 const editProduct = (product: ProductData, categoryId: number) => {
  if (dataToUse) {
   const sourceCategory = dataToUse.find((category) => category.products.some((p) => p.id === product.id));

   if (sourceCategory) {
    sourceCategory.products = sourceCategory.products.filter((p) => p.id !== product.id);

    const targetCategory = dataToUse.find((category) => category.id === categoryId);

    if (targetCategory) {
     targetCategory.products.push(product);

     if (gptData) {
      setGptData([...dataToUse]);
     } else if (jsonData) {
      setJsonData([...dataToUse]);
     } else if (categories) {
      setCategories([...dataToUse]);
     }
    } else {
     console.error(`Category with ID ${categoryId} not found.`);
    }
   } else {
    console.error(`Product with ID ${product.id} not found in any category.`);
   }
  } else {
   console.error("No data source available to edit the product.");
  }
 };

 const deleteProduct = (productId: number, categoryId: number) => {
  if (dataToUse) {
   const targetCategory = dataToUse.find((category) => category.id === categoryId);
   if (targetCategory) {
    const updatedProducts = targetCategory.products.filter((product) => product.id !== productId);

    const updatedCategory: CategoryData = {
     ...targetCategory,
     products: updatedProducts,
    };

    if (gptData) {
     const updatedGptData = gptData.map((category) => (category.id === categoryId ? updatedCategory : category));
     setGptData(updatedGptData);
    } else if (jsonData) {
     const updatedJsonData = jsonData.map((category) => (category.id === categoryId ? updatedCategory : category));
     setJsonData(updatedJsonData);
    } else if (categories) {
     const updatedCategories = categories.map((category) => (category.id === categoryId ? updatedCategory : category));
     setCategories(updatedCategories);
    }
   } else {
    console.error(`Category with ID ${categoryId} not found.`);
   }
  } else {
   console.error("No data source available to delete the product.");
  }
 };

 const handleToggleRoleChange = (id: number) => {
  setUsers((users) =>
   users.map((user) => {
    return user.id === id ? { ...user, role: toggleRole(user) } : user;
   }),
  );
 };

 const changeModal = (element: string) => {
  setCurrentModal(element);
 };

 const getEmbedYTLink = (ytLink: string): string => {
  let ytId: string | null = null;
  if (ytLink.match(/youtu.be\/([\w-]+)(\?t=\d+)?/)) {
   const match = ytLink.match(/youtu.be\/([\w-]+)(\?t=\d+)?/);
   if (match) {
    ytId = match[1];
   }
  }
  if (!ytId) {
   const match = ytLink.match(/youtube\.com\/watch\?v=([\w-]+)/);
   if (match) {
    ytId = match[1];
   }
  }
  if (!ytId) {
   const match = ytLink.match(/youtube\.com\/embed\/([\w-]+)/);
   if (match) {
    ytId = match[1];
   }
  }
  if (!ytId) {
   throw new Error("Not a correct YouTube link");
  }

  return `https://www.youtube.com/embed/${ytId}`;
 };

 const saveLoggedUserRole = (string: string) => {
  if (!string) return;
  setLoggedUserRole(string);
 };

 const saveLoggedUserEmail = (string: string) => {
  if (!string) return;
  setLoggedUserEmail(string);
 };

 const clearLoggedUserRole = () => {
  setLoggedUserRole("");
 };
 const clearLoggedUserEmail = () => {
  setLoggedUserEmail("");
 };

 const handleModalOpen = () => setIsModalOpen(true);

 const handleModalClose = () => setIsModalOpen(false);

 return {
  isLoading,
  isModalOpen,
  currentModal,
  categories,
  jsonData,
  gptData,
  users,
  loggedUserRole,
  loggedUserEmail,
  setIsLoading,
  findCategoryId,
  findFreeCategoryId,
  addCategory,
  editCategory,
  deleteCategory,
  findFreeProductId,
  addProduct,
  editProduct,
  deleteProduct,
  setJsonData,
  setGptData,
  changeModal,
  handleModalOpen,
  handleModalClose,
  handleToggleRoleChange,
  getEmbedYTLink,
  setUsers,
  saveLoggedUserRole,
  saveLoggedUserEmail,
  clearLoggedUserRole,
  clearLoggedUserEmail,
 };
};

export const useOrderAiContext = () => {
 return useContext(OrderAiContext);
};
