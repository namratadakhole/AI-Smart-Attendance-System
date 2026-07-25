import { toast } from "sonner";

/**
 * Reusable notification utility for the AI Smart Attendance System.
 * Ensures consistent look, feel, animations, and icons.
 */

export const showSuccess = (title: string, description?: string) => {
  toast.success(title, {
    description,
    duration: 4000,
  });
};

export const showError = (title: string, description?: string) => {
  toast.error(title, {
    description,
    duration: 4000,
  });
};

export const showWarning = (title: string, description?: string) => {
  toast.warning(title, {
    description,
    duration: 4000,
  });
};

export const showInfo = (title: string, description?: string) => {
  toast.info(title, {
    description,
    duration: 4000,
  });
};
