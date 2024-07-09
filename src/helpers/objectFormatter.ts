import _ from "lodash";
export const getSpecificPropertiesFromObject = (
  obj: Object,
  mapping: Object,
) => {
  const cloneObj = _.cloneDeep(obj);
  const activeKey = Object.keys(
    Object.fromEntries(Object.entries(mapping).filter(([key, value]) => value)),
  );
  const filteredByActiveKey = Object.fromEntries(
    Object.entries(cloneObj).filter(([key, value]) => activeKey.includes(key)),
  );
  return filteredByActiveKey;
};
