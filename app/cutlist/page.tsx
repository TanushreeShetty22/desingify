import { CutlistData } from "@/components/cutlist-data";
import { UseCabinetDataInitializer } from "@/components/use-cabinet-data-initializer";

const Cutlist = () => {
  return (
    <>
      <UseCabinetDataInitializer />
      <CutlistData />
    </>
  );
};

export default Cutlist;
