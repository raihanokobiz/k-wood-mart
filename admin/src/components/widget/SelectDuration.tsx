import { Menu } from "@headlessui/react";
// import Icon from "@/components/Icon";
import { TbLayoutNavbarExpand } from "react-icons/tb";

interface SelectDurationProps {
  setSelectChartFilter: (value: string) => void;
  setSelectChartFilterLabel: (label: string) => void;
}

const SelectDuration = ({ setSelectChartFilter, setSelectChartFilterLabel }: SelectDurationProps) => {
  const actions = [
    { name: "This Day", value: "this-day" },
    { name: "Previous Day", value: "prv-day" },
    { name: "This Week", value: "this-week" },
    { name: "Previous Week", value: "prv-week" },
    { name: "This Month", value: "this-month" },
    { name: "Previous Month", value: "prv-month" },
    { name: "This Year", value: "this-year" },
    { name: "Previous Year", value: "prv-year" },
  ];

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="text-lg inline-flex items-center justify-center  dark:border-slate-700 rounded dark:text-slate-400">
        <div className="flex items-center space-x-2 py-2 px-4 rounded-md bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">
          <span className="text-sm font-semibold">Duration</span>
        <TbLayoutNavbarExpand />
        </div>
      </Menu.Button>

      <Menu.Items className="absolute z-10 mt-2 w-[140px] origin-top-right rounded-md bg-white dark:bg-slate-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        {actions.map((item, i) => (
          <Menu.Item key={i}>
            {({ active }) => (
              <div
                onClick={() => {
                  setSelectChartFilter(item.value);
                  setSelectChartFilterLabel(item.name);
                }}
                className={`${
                  active ? "bg-secondary-500 text-[#D4A373]" : "text-slate-900 dark:text-slate-300"
                } cursor-pointer border-b border-gray-200 px-4 py-2 text-sm flex items-center space-x-2`}
              >
                <span>{item.name}</span>
              </div>
            )}
          </Menu.Item>
        ))}
      </Menu.Items>
    </Menu>
  );
};

export default SelectDuration;
