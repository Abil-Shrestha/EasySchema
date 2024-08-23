import {create} from "zustand";
import {v4 as uuidv4} from "uuid";
type ToolbarStore = {
  isOpen: boolean;
};

export const useToolbarStore = create<ToolbarStore>((set) => ({
  isOpen: false,
}));
