import { useSelectorProjectDetail } from "@/store/hook";
import NewProjectInfoTab from "./NewProjectInfoTab";
import OldProjectInfoTab from "./OldProjectInfoTab";

const ProjectInfoTab = () => {
  const { isNewVersion } = useSelectorProjectDetail();

  return (
    <>
      {
        isNewVersion ? (
          <NewProjectInfoTab />
        ) : (
          <OldProjectInfoTab />
        )
      }
    </>
  );
};

export default ProjectInfoTab;
