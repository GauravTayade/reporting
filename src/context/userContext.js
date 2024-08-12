import {createContext} from "react";

const userContext = createContext({
  reportStartDate:null,
  reportEndDate:null,
  employeeId:'17538717-6818-4769-b518-4b38cfd42de4',
  reportId:'3eb77c2f-b840-4d2b-8bb6-dd4dfdcc814e',
  selectedCustomer: [], selectedReports: []
})

export default userContext;