import {createContext} from "react";

const userContext = createContext({
  reportStartDate:null,
  reportEndDate:null,
  previousReportStartDate:null,
  previousReportEndDate:null,
  employeeId:'17538717-6818-4769-b518-4b38cfd42de4',
  reportId:null,
  selectedCustomer: [], selectedReports: []
})

export default userContext;