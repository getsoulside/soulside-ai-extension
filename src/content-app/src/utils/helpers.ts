import { toggleEhrSessionNotesLoading } from "@/domains/sessionNotes/services/sessionNotesService";
import AdvancedMD from "@/ehrClients/AdvancedMD";
import Alleva from "@/ehrClients/Alleva";
import { getNavigateFunction } from "@/hooks/useNavigate";
import { toast } from "react-toastify";

export const copyToClipboard = (str: string = ""): void => {
  function listener(e: ClipboardEvent) {
    e?.clipboardData?.setData("text/html", str);
    e?.clipboardData?.setData("text/plain", str);
    e.preventDefault();
  }
  document.addEventListener("copy", listener);
  document.execCommand("copy", true, str);
  document.removeEventListener("copy", listener);
};

export const convertToTitleCase = (str: string) => {
  return str
    .split("_") // Split the string by underscores
    .map(
      (
        word // Map over each word
      ) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() // Capitalize the first letter and make the rest lowercase
    )
    .join(" "); // Join the words back with spaces
};

export const convertStringToHash = (str: string) => {
  let hash = 0;
  if (str.length === 0) return hash.toString();
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32-bit integer
  }
  return hash.toString(16); // Return hexadecimal string
};

export const getEhrClient = (): typeof AdvancedMD | typeof Alleva | null => {
  const currentUrl = window.location.href;
  if (currentUrl.includes("advancedmd.com")) {
    return AdvancedMD;
  } else if (currentUrl.includes("allevasoft.com")) {
    return Alleva;
  }
  return null;
};

export const openActiveSessionNotes = async ({
  silentEvent = false,
}: { silentEvent?: boolean } = {}) => {
  const navigate = getNavigateFunction();
  const EhrClient = getEhrClient();
  if (EhrClient) {
    EhrClient.resetInstance();
    const ehrClientInstance = EhrClient.getInstance();
    toggleEhrSessionNotesLoading(true);
    try {
      const activeSession = await ehrClientInstance.getActiveSession();
      if (activeSession) {
        navigate(
          `/session-details/${activeSession.sessionCategory}/${activeSession.modeOfDelivery}/${activeSession.id}`
        );
      } else {
        if (!silentEvent) {
          toast.error("No active session found");
        }
      }
    } catch (error: any) {
      if (error?.error_code && error?.message) {
        toast.error(error.message);
      }
    }
    toggleEhrSessionNotesLoading(false);
  }
};
