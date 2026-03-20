import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
const mototLogo = "/placeholder.svg";

interface SchoolSettings {
  name: string;
  subtitle: string;
  logo: string;
  logoUrl: string;
  studentIdFormat: string;
  currentTerm: string;
  currentYear: string;
  motto: string;
  address: string;
  phone: string;
  email: string;
  schoolLevel: string;
  primaryGrades: string;
  secondaryGrades: string;
  gradingSystem: string;
  departments: string;
}

interface SchoolContextType {
  settings: SchoolSettings;
  updateSettings: (partial: Partial<SchoolSettings>) => void;
  uploadLogo: (file: File) => Promise<string | null>;
  loading: boolean;
  allGrades: string[];
  primaryGradesList: string[];
  secondaryGradesList: string[];
  departmentsList: string[];
}

const keyMap: Record<string, keyof SchoolSettings> = {
  school_name: "name",
  school_subtitle: "subtitle",
  school_motto: "motto",
  school_address: "address",
  school_phone: "phone",
  school_email: "email",
  student_id_format: "studentIdFormat",
  current_term: "currentTerm",
  current_year: "currentYear",
  school_level: "schoolLevel",
  primary_grades: "primaryGrades",
  secondary_grades: "secondaryGrades",
  grading_system: "gradingSystem",
  departments: "departments",
  school_logo_url: "logoUrl",
};

const reverseKeyMap: Record<string, string> = Object.fromEntries(
  Object.entries(keyMap).map(([k, v]) => [v, k])
);

const defaultSettings: SchoolSettings = {
  name: "Motot School",
  subtitle: "Secondary & Primary",
  logo: mototLogo,
  logoUrl: "",
  studentIdFormat: "MOT-{YEAR}-{SEQ}",
  currentTerm: "Term 1",
  currentYear: "2024",
  motto: "Education for Excellence",
  address: "P.O. Box 123, Nandi County, Kenya",
  phone: "+254 700 000 000",
  email: "info@motot.ac.ke",
  schoolLevel: "both",
  primaryGrades: "Class 1,Class 2,Class 3,Class 4,Class 5,Class 6,Class 7,Class 8",
  secondaryGrades: "Form 1,Form 2,Form 3,Form 4",
  gradingSystem: "percentage",
  departments: "Sciences,Languages,Humanities,Mathematics,Technical",
};

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

export function SchoolProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SchoolSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from("school_settings").select("key, value");
      if (data) {
        const updates: Partial<SchoolSettings> = {};
        data.forEach(row => {
          const field = keyMap[row.key];
          if (field) (updates as any)[field] = row.value;
        });
        // If a logo URL was stored, use it instead of the default
        if (updates.logoUrl) {
          updates.logo = updates.logoUrl;
        }
        setSettings(prev => ({ ...prev, ...updates }));
      }
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const updateSettings = async (partial: Partial<SchoolSettings>) => {
    setSettings(prev => ({ ...prev, ...partial }));

    for (const [field, value] of Object.entries(partial)) {
      const dbKey = reverseKeyMap[field];
      if (dbKey && typeof value === "string") {
        // Upsert - try update first, if no rows affected, insert
        const { data } = await supabase
          .from("school_settings")
          .update({ value })
          .eq("key", dbKey)
          .select();
        
        if (!data || data.length === 0) {
          await supabase
            .from("school_settings")
            .insert({ key: dbKey, value });
        }
      }
    }
  };

  const uploadLogo = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `logo-${Date.now()}.${fileExt}`;
    const filePath = `logos/${fileName}`;

    const { error } = await supabase.storage
      .from("school-assets")
      .upload(filePath, file, { upsert: true });

    if (error) {
      console.error("Upload error:", error);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from("school-assets")
      .getPublicUrl(filePath);

    const publicUrl = urlData.publicUrl;

    // Update settings with new logo URL
    await updateSettings({ logo: publicUrl, logoUrl: publicUrl });

    return publicUrl;
  };

  const primaryGradesList = settings.primaryGrades.split(",").map(g => g.trim()).filter(Boolean);
  const secondaryGradesList = settings.secondaryGrades.split(",").map(g => g.trim()).filter(Boolean);
  const departmentsList = settings.departments.split(",").map(d => d.trim()).filter(Boolean);

  const allGrades = settings.schoolLevel === "primary"
    ? primaryGradesList
    : settings.schoolLevel === "secondary"
    ? secondaryGradesList
    : [...primaryGradesList, ...secondaryGradesList];

  return (
    <SchoolContext.Provider value={{
      settings, updateSettings, uploadLogo, loading,
      allGrades, primaryGradesList, secondaryGradesList, departmentsList
    }}>
      {children}
    </SchoolContext.Provider>
  );
}

export function useSchool() {
  const ctx = useContext(SchoolContext);
  if (!ctx) throw new Error("useSchool must be used within SchoolProvider");
  return ctx;
}
