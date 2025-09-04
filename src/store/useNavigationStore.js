import { create } from "zustand";

const useNavigationStore = create((set) => ({
  selectedPage: "posts",

  setSelectedPage: (page) => {
    set({ selectedPage: page });
  },
}));

export { useNavigationStore };
