import "./index.css";
import "primeicons/primeicons.css";

import "primereact/resources/themes/lara-light-cyan/theme.css";
import { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import { InputNumber } from "primereact/inputnumber";

import {
  Box,
  Tabs,
  Flex,
  Input,
  Button,
  Tab,
  IconButton,
  TabPanels,
  TabPanel,
  TabList,
  Image,
  Heading,
  Divider,
  Accordion,
  AccordionButton,
  AccordionPanel,
  AccordionItem,
  AccordionIcon,
  Text,
} from "@chakra-ui/react";


import {
  ArrowForwardIcon,
  AddIcon,
  ArrowBackIcon,
  MinusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DeleteIcon,
} from "@chakra-ui/icons";

import "./App.css";

const App = () => {
  

 const [startDate, setStartDate] = useState(new Date()); // Initial start date

 const handleNextWeek = () => {
   const newStartDate = new Date(startDate);
   newStartDate.setDate(newStartDate.getDate() + 7); // Move to the next week
   setStartDate(newStartDate);
   updateWeek(startDate);
   console.log(startDate);
 };

 const handlePreviousWeek = () => {
   const newStartDate = new Date(startDate);
   newStartDate.setDate(newStartDate.getDate() - 7); // Move to the previous week
   setStartDate(newStartDate);
    updateWeek(startDate);
   console.log(startDate);
 };

 const dt = useRef(null);
 const [rows, setRows] = useState([
   {
     projectType: "BAU Activity",
     projectName: "",
     task: "",
     comment: "",
     hours: { mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 },
     total: 0,
   },
   {
     projectType: "Sales Activity",
     projectName: "",
     task: "",
     comment: "",
     hours: { mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 },
     total: 0,
   },

 ]);
  
  const updateWeek = (newStartDate) => {
    const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
    const newWeek = {};
    days.forEach((day, index) => {
      const currentDate = new Date(
        newStartDate.getTime() + index * 24 * 60 * 60 * 1000
      );
      newWeek[day] = formatStartDate(currentDate);
    });
    setWeek(newWeek);
    console.log(week);
  };

 const [week, setWeek] = useState({
   mon: "",
   tue: "",
   wed: "",
   thu: "",
   fri: "",
   sat: "",
   sun: "",
 });
 const [total, setTotal] = useState({
   mon: 0,
   tue: 0,
   wed: 0,
   thu: 0,
   fri: 0,
   sat: 0,
   sun: 0,
   overall: 0,
 });

 useEffect(() => {
   const newTotal = rows.reduce(
     (acc, row) => {
       Object.keys(row.hours).forEach((day) => {
         acc[day] = (acc[day] || 0) + (row.hours[day] || 0);
       });
       return acc;
     },
     { overall: 0 }
   );
   newTotal.overall =
     Object.values(newTotal).reduce((a, b) => a + b, 0) - newTotal.overall;
   setTotal(newTotal);
   console.log("Updated totals");
 }, [rows]);
  
   useEffect(() => {
     updateWeek(startDate);
     console.log(startDate);
   }, [startDate]);

//  useEffect(() => {
//    const timeoutId = setTimeout(() => {
//      localStorage.setItem("timesheetData", JSON.stringify(rows));
//      console.log("Saved data to local storage");
//    }, 1000);
//    return () => clearTimeout(timeoutId);
//  }, [rows]);

 const onCellEditComplete = (e) => {
   let { rowData, newValue, field, originalEvent: event } = e;
   if (newValue.trim().length > 0) {
     const index = rows.findIndex((row) => row === rowData);
     const newRows = [...rows];
     newRows[index][field] = newValue;
     setRows(newRows);
   } else {
     event.preventDefault();
   }
 };

  const formatStartDate = (date) => {
    console.log(
      date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    );
     return date.toLocaleDateString("en-US", {
       month: "short",
       day: "numeric",
     });
     

   };

  
 const textEditor = (options) => {
   return (
     <Input
       type="text"
       value={options.value}
       variant="filled"
       size="sm"
       w="70px"
       p="7px"
       fontSize="13px"
       color="gray.500"
       bgColor="gray.100"
     
       fontWeight="light"
       _focus={{
         bgColor: "gray.100",
         borderColor: "transparent",
       }}
       onChange={(e) => options.editorCallback(e.target.value)}
     />
   );
 };

const numberEditor = (day) => {
  // eslint-disable-next-line react/display-name
  return (props) => (
    <InputNumber
    className="w-1"
      {...props}
      onChange={(e) => {
        
        const newRows = [...rows];
        newRows[props.rowIndex].hours[day] = e.value || 0;
        newRows[props.rowIndex].total = Object.values(
          newRows[props.rowIndex].hours
        ).reduce((a, b) => a + b, 0);
        setRows(newRows);
        const newTotal = { ...total };
        newTotal[day] = newRows.reduce(
          (sum, row) => sum + (row.hours[day] || 0),
          0
        );
        newTotal.overall =
          Object.values(newTotal).reduce((a, b) => a + b, 0) -
          newTotal.overall;
        setTotal(newTotal);
      }}
    />
  );
};

 const addRow = (type) => {
   // Find the index of the last row with the same project type
   let lastIndex;
   if (type === "Sales Activity") {
     lastIndex = rows.length;
   } else {
     lastIndex = rows.findIndex((row) => row.projectType === "Sales Activity");
     if (lastIndex === -1) lastIndex = rows.length;
   }

   // Insert the new row at the calculated index
   setRows((prevRows) => [
     ...prevRows.slice(0, lastIndex),
     {
       projectType: type,
       projectName: "",
       task: "",
       comment: "",
       hours: { mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 },
       total: 0,
     },
     ...prevRows.slice(lastIndex),
   ]);
 };




  
 const removeRow = (index) => {
   if (index !== 0) {
     const newRows = rows.filter((row, i) => i !== index);
     setRows(newRows);
   }
 };

 const saveData = () => {
   localStorage.setItem("timesheetData", JSON.stringify(rows));
  dt.current.exportCSV();
   console.log(JSON.stringify(rows));
 };

 const exportCSV = async () => {
   try {
     console.log(startDate.toISOString());
     const rowsArray = JSON.parse(JSON.stringify(rows));
     rowsArray.push({ "Project Type": "Total Hours", total });
     rowsArray.push({ startDate: startDate.toISOString() });

     const dataToSend = JSON.stringify(rowsArray);
     console.log(dataToSend);
      const response = await fetch("http://localhost:3000/api/updateData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: dataToSend, 
    });
    const responseData = await response.json();
    console.log('Response from server:', responseData);
  } catch (error) {
    console.error('Error exporting CSV:', error);
  }
 };
  
  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/data");
      const jsonData = await response.json();
      console.log(jsonData.slice(0, -2));
      console.log(jsonData[jsonData.length - 1]);
      const filteredRows = jsonData.slice(0, -2);
      setRows(filteredRows);
      const dateFromString = new Date(jsonData[jsonData.length - 1]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDeleteData = async () => {
    try {
      console.log(startDate);
      const response = await fetch("http://localhost:3000/api/deleteData", {
        method: "DELETE",
      });
      if (response.ok) {
        console.log("Data deleted successfully");
      } else {
        console.error("Failed to delete data:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };



 const headerGroup = (
   <ColumnGroup className="p-datatable-header ">
     <Row>
       <Column
         header="Project Type"
         rowSpan={3}
         className="p-column-title p-datatable-thead"
       />
       <Column
         header="Project Name"
         rowSpan={3}
         className="p-column-title p-datatable-thead"
       />
       <Column
         header="Task"
         rowSpan={3}
         className="p-column-title p-datatable-thead"
       />
       <Column
         header="Comment"
         rowSpan={3}
         className="p-column-title p-datatable-thead"
       />
       <Column
         header={`Mon-${week.mon}`}
         className="p-column-title p-datatable-thead"
       />
       <Column
         header={`Tue-${week.tue}`}
         className="p-column-title p-datatable-thead"
       />
       <Column
         header={`Wed-${week.wed}`}
         className="p-column-title p-datatable-thead"
       />
       <Column
         header={`Thu-${week.thu}`}
         className="p-column-title p-datatable-thead"
       />
       <Column
         header={`Fri-${week.fri}`}
         className="p-column-title p-datatable-thead"
       />
       <Column
         header={`Sat-${week.sat}`}
         className="p-column-title p-datatable-thead"
       />
       <Column
         header={`Sun-${week.sun}`}
         className="p-column-title p-datatable-thead"
       />
       <Column
         header="Total"
         rowSpan={3}
         className="p-column-title p-datatable-thead"
       />
     </Row>
    
   </ColumnGroup>
 );

 const footerGroup = (
   <ColumnGroup className="p-datatable-footer">
     <Row>
       <Column
         footer="Total Hours"
         className="p-datatable-tfoot p-column-title"
       />
       <Column className="p-datatable-tfoot" />
       <Column className="p-datatable-tfoot" />
       <Column className="p-datatable-tfoot" />
       <Column className="p-datatable-tfoot" footer={total.mon} />
       <Column className="p-datatable-tfoot" footer={total.tue} />
       <Column className="p-datatable-tfoot" footer={total.wed} />
       <Column className="p-datatable-tfoot" footer={total.thu} />
       <Column className="p-datatable-tfoot" footer={total.fri} />
       <Column className="p-datatable-tfoot" footer={total.sat} />
       <Column className="p-datatable-tfoot" footer={total.sun} />
       <Column className="p-datatable-tfoot" footer={total.overall} />
     </Row>
     <Row>
       <Column footer="Machine Hours" />
     </Row>
     <Row>
       <Column footer="Break Hours"/>
     </Row>
   </ColumnGroup>
 );

  return (
    <Box>
      {/* -------- tab menu list starts --------- */}

      <Tabs isLazy orientation="vertical" variant="unstyled">
        <TabList
          textColor="white"
          width="210px"
          height="654px"
          bgGradient="linear(#19105b, #612a6e, #fe6196)"
          pl="5px"
          position="relative"
        >
          <Image
            src="../public/page_logo.png"
            w="20px"
            h="27.2px"
            mt="10px"
            ml="17px"
            mb="20px"
          ></Image>
          <Tab
            justifyContent="left"
            fontSize="12px"
            fontWeight="400"
            fontFamily="Arial"
          >
            Dashboard
          </Tab>
          <Tab
            justifyContent="left"
            fontSize="12px"
            fontWeight="400"
            fontFamily="Arial"
          >
            Timesheet
          </Tab>
          <Tab
            fontSize="12px"
            fontWeight="400"
            fontFamily="Arial"
            justifyContent="left"
          >
            Leave
          </Tab>
          <Tab
            fontSize="12px"
            fontWeight="400"
            fontFamily="Arial"
            justifyContent="left"
          >
            Work From Home
          </Tab>
          <Tab
            fontSize="12px"
            fontWeight="400"
            fontFamily="Arial"
            justifyContent="left"
          >
            Feedback
          </Tab>
          <Tab
            fontSize="12px"
            fontWeight="400"
            fontFamily="Arial"
            justifyContent="left"
          >
            Survey
          </Tab>
          <Tab
            fontSize="12px"
            fontWeight="400"
            fontFamily="Arial"
            justifyContent="left"
          >
            Service Desk
          </Tab>
          <Tab
            fontSize="12px"
            fontWeight="400"
            fontFamily="Arial"
            justifyContent="left"
          >
            Forms
          </Tab>
          <Tab
            fontSize="12px"
            fontWeight="400"
            fontFamily="Arial"
            justifyContent="left"
          >
            Travel
          </Tab>
          <Tab
            fontSize="12px"
            fontWeight="400"
            fontFamily="Arial"
            justifyContent="left"
          >
            Expenses
          </Tab>
          <Tab
            fontSize="12px"
            fontWeight="400"
            fontFamily="Arial"
            justifyContent="left"
          >
            Resourcing
          </Tab>
          <Flex
            position="absolute"
            bottom="0"
            w="100%"
            pb="20px"
            flexDirection="column"
          >
            <Divider mb="20px" colorScheme="red" />
            <Flex justifyContent="space-evenly" alignItems="center">
              <Text fontSize="10px" fontWeight="700" fontFamily="Arial">
                Lokesh Devaraj
              </Text>
              <a href="#">
                <i className="pi pi-sign-out" style={{ fontSize: "1rem" }}></i>
              </a>
            </Flex>
          </Flex>
        </TabList>

        {/* -------- tab menu list ends --------- */}

        {/* -------- tab panel starts --------- */}

        <TabPanels>
          <TabPanel>
            <Heading
              as="h2"
              size="lg"
              textColor="rgb(25, 16, 91)"
              fontFamily="Arial"
              p="5px"
            >
              Dashboard
            </Heading>
          </TabPanel>
          <TabPanel>
            {/* -------- Timesheet panel starts --------- */}

            <Box pt="5px">
              <Heading
                as="h2"
                size="lg"
                textColor="rgb(25, 16, 91)"
                fontFamily="Arial"
                mb="20px"
              >
                Timesheet
              </Heading>

              <Flex justifyContent="space-between" p="2px">
                <Text
                  sx={{
                    fontSize: "13px",
                    fontFamily: "Arial",
                    fontWeight: 700,
                  }}
                  mb="20px"
                >
                  Total Hours: {total.overall}
                </Text>
                <Text
                  sx={{
                    fontSize: "13px",
                    fontFamily: "Arial",
                    fontWeight: 700,
                  }}
                  mb="20px"
                  color="#6D6D6D"
                >
                  <IconButton
                    variant="unstyled"
                    fontSize="15px"
                    icon={<ChevronLeftIcon color="gray.500 " />}
                    onClick={handlePreviousWeek}
                  ></IconButton>
                  {`${formatStartDate(startDate)}, 2024 - ${formatStartDate(
                    new Date(startDate.getTime() + 6 * 24 * 60 * 60 * 1000)
                  )}, 2024`}
                  <IconButton
                    variant="unstyled"
                    fontSize="15px"
                    icon={<ChevronRightIcon color="gray.500 " />}
                    onClick={handleNextWeek}
                  ></IconButton>
                </Text>
              </Flex>

              {/* -------- Timesheet Accordion starts --------- */}

              <Accordion allowToggle mb="10px">
                <AccordionItem>
                  <AccordionButton
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "13px",
                      fontFamily: "Arial",
                      fontWeight: 400,
                      pl: 2,
                      "&:hover": {
                        backgroundColor: "#19105b",
                      },
                      "&:active": {
                        backgroundColor: "#19105b",
                      },
                    }}
                    bgColor="#19105b"
                    color="white"
                  >
                    Allocation Extension
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel
                    sx={{
                      p: 0,
                      m: 0,
                    }}
                  >
                    <Box
                      w="100%"
                      sx={{
                        fontWeight: 700,
                        textAlign: "left",
                        fontSize: "13px",
                        fontFamily: "Arial",
                      }}
                    >
                      <table className="table-auto w-full">
                        <tr className="bg-[#ffe5ee]">
                          <td className="p-2">Project name</td>
                          <td>Project type</td>
                          <td>Project end date</td>
                          <td>Allocation end date</td>
                          <td>Allocation extension</td>
                        </tr>
                      </table>
                    </Box>

                    <Flex
                      sx={{
                        fontSize: "13px",
                        fontFamily: "Arial",
                        fontWeight: 400,
                      }}
                      textColor="#6a6c71"
                      justifyContent="center"
                      height="30px"
                      alignContent="center"
                      pt="5px"
                    >
                      No available options
                    </Flex>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>

              {/* -------- Timesheet Accordion ends --------- */}

              {/* Timesheet Table starts */}

              <Box
                bgColor="#19105b"
                color="white"
                fontSize="13px"
                fontFamily="Arial"
                fontWeight="400"
                height="35px"
                p="2"
              >
                Timesheet
              </Box>
              <Box
                w="100%"
                mb="20px"
                sx={{
                  fontWeight: 700,
                  textAlign: "left",
                  fontSize: "13px",
                  fontFamily: "Arial",
                }}
              >
                <div className="p-datatable card p-fluid">
                  <DataTable
                    value={rows}
                    ref={dt}
                    headerColumnGroup={headerGroup}
                    footerColumnGroup={footerGroup}
                    editMode="cell"
                    size="small"
                    tableStyle={{
                      minWidth: "50rem",
                      width: "100%",
                    }}
                  >
                    <Column
                      field="projectType"
                      key="projectType"
                      // editor={(options) => textEditor(options)}
                      // onCellEditComplete={onCellEditComplete}
                    />
                    <Column
                      field="projectName"
                      key="projectName"
                      editor={(options) => textEditor(options)}
                      onCellEditComplete={onCellEditComplete}
                    />
                    <Column
                      field="task"
                      key="task"
                      editor={(options) => textEditor(options)}
                      onCellEditComplete={onCellEditComplete}
                    />
                    <Column
                      field="comment"
                      key="comment"
                      editor={(options) => textEditor(options)}
                      onCellEditComplete={onCellEditComplete}
                    />
                    <Column
                      field="hours.mon"
                      key="hours.mon"
                      editor={numberEditor("mon")}
                      editorValidator={(rowData) => {
                        const monHours = rowData.hours.mon;
                        return monHours <= 8; // Validate if the entered value is less than or equal to 8
                      }}
                      body={(rowData, column) => (
                        <div
                          style={{
                            color: rowData.hours.mon > 8 ? "red" : "inherit",
                          }}
                        >
                          {rowData.hours.mon}
                        </div>
                      )}
                    />
                    <Column
                      field="hours.tue"
                      key="hours.tue"
                      editor={numberEditor("tue")}
                      editorValidator={(rowData) => {
                        const monHours = rowData.hours.tue;
                        return monHours <= 8; // Validate if the entered value is less than or equal to 8
                      }}
                      body={(rowData, column) => (
                        <div
                          style={{
                            color: rowData.hours.tue > 8 ? "red" : "inherit",
                          }}
                        >
                          {rowData.hours.tue}
                        </div>
                      )}
                    />
                    <Column
                      field="hours.wed"
                      key="hours.wed"
                      editor={numberEditor("wed")}
                      editorValidator={(rowData) => {
                        const monHours = rowData.hours.wed;
                        return monHours <= 8; // Validate if the entered value is less than or equal to 8
                      }}
                      body={(rowData, column) => (
                        <div
                          style={{
                            color: rowData.hours.wed > 8 ? "red" : "inherit",
                          }}
                        >
                          {rowData.hours.wed}
                        </div>
                      )}
                    />
                    <Column
                      field="hours.thu"
                      key="hours.thu"
                      editor={numberEditor("thu")}
                      editorValidator={(rowData) => {
                        const monHours = rowData.hours.thu;
                        return monHours <= 8; // Validate if the entered value is less than or equal to 8
                      }}
                      body={(rowData, column) => (
                        <div
                          style={{
                            color: rowData.hours.thu > 8 ? "red" : "inherit",
                          }}
                        >
                          {rowData.hours.thu}
                        </div>
                      )}
                    />
                    <Column
                      field="hours.fri"
                      key="hours.fri"
                      editor={numberEditor("fri")}
                      editorValidator={(rowData) => {
                        const monHours = rowData.hours.fri;
                        return monHours <= 8; // Validate if the entered value is less than or equal to 8
                      }}
                      body={(rowData, column) => (
                        <div
                          style={{
                            color: rowData.hours.fri > 8 ? "red" : "inherit",
                          }}
                        >
                          {rowData.hours.fri}
                        </div>
                      )}
                    />
                    <Column
                      field="hours.sat"
                      key="hours.sat"
                      editor={numberEditor("sat")}
                      editorValidator={(rowData) => {
                        const monHours = rowData.hours.sat;
                        return monHours <= 8; // Validate if the entered value is less than or equal to 8
                      }}
                      body={(rowData, column) => (
                        <div
                          style={{
                            color: rowData.hours.sat > 8 ? "red" : "inherit",
                          }}
                        >
                          {rowData.hours.sat}
                        </div>
                      )}
                    />
                    <Column
                      field="hours.sun"
                      key="hours.sun"
                      editor={numberEditor("sun")}
                      editorValidator={(rowData) => {
                        const monHours = rowData.hours.sun;
                        return monHours <= 8; // Validate if the entered value is less than or equal to 8
                      }}
                      body={(rowData, column) => (
                        <div
                          style={{
                            color: rowData.hours.sun > 8 ? "red" : "inherit",
                          }}
                        >
                          {rowData.hours.sun}
                        </div>
                      )}
                    />
                    <Column
                      field="total"
                      key="total"
                      style={{ fontWeight: "bold" }}
                      editor={false}
                    />
                    <Column
                      body={(rowData, column) => (
                        <IconButton
                          variant="unstyled"
                          fontSize="15px"
                          onClick={() => {
                            addRow(rowData.projectType);
                            console.log(rowData);
                          }}
                          icon={<AddIcon color="gray.500 " />}
                        ></IconButton>
                      )}
                      style={{ border: "0px solid white" }}
                    />
                    <Column
                      style={{ border: "0px solid white" }}
                      body={(rowData, column) => {
                        const isFirstSales =
                          rows.findIndex(
                            (row) => row.projectType === "Sales Activity"
                          ) === rows.indexOf(rowData);
                        const isFirstBAU =
                          rows.findIndex(
                            (row) => row.projectType === "BAU Activity"
                          ) === rows.indexOf(rowData);

                        if (!isFirstSales && !isFirstBAU) {
                          return (
                            <IconButton
                              variant="unstyled"
                              fontSize="15px"
                              icon={<MinusIcon color="gray.500 " />}
                              onClick={() => {
                                removeRow(rows.indexOf(rowData));
                              }}
                            />
                          );
                        } else {
                          return null;
                        }
                      }}
                    />
                  </DataTable>
                </div>
              </Box>

              {/* --------------- Timesheet Table ends ------------------- */}

              <Flex justifyContent="flex-end">
                <Button
                  bgColor="#19105b"
                  variant="solid"
                  w="120px"
                  color="white"
                  fontSize="13px"
                  fontFamily="Arial"
                  borderRadius="4px"
                  fontWeight="light"
                  mr="20px"
                  _hover={{ bgColor: "#19105b" }}
                  _active={{ bgColor: "#19105b" }}
                  onClick={saveData}
                >
                  SAVE
                </Button>
                <Button
                  bgColor="#ff6196"
                  variant="solid"
                  w="120px"
                  color="white"
                  fontSize="13px"
                  mr="20px"
                  fontFamily="Arial"
                  borderRadius="4px"
                  fontWeight="light"
                  rightIcon={<ArrowForwardIcon />}
                  _hover={{ bgColor: "#ff6196" }}
                  _active={{ bgColor: "#ff6196" }}
                  onClick={exportCSV}
                >
                  SUBMIT
                </Button>
                <Button
                  bgColor="#ff6196"
                  variant="solid"
                  w="120px"
                  color="white"
                  fontSize="13px"
                  fontFamily="Arial"
                  borderRadius="4px"
                  fontWeight="light"
                  rightIcon={<ArrowBackIcon />}
                  _hover={{ bgColor: "#ff6196" }}
                  _active={{ bgColor: "#ff6196" }}
                  onClick={fetchData}
                  mr="20px"
                >
                  FETCH
                </Button>

                <Button
                  bgColor="#ff6196"
                  variant="solid"
                  w="120px"
                  color="white"
                  fontSize="13px"
                  fontFamily="Arial"
                  borderRadius="4px"
                  fontWeight="light"
                  rightIcon={<DeleteIcon />}
                  _hover={{ bgColor: "#ff6196" }}
                  _active={{ bgColor: "#ff6196" }}
                  onClick={handleDeleteData}
                >
                  DELETE
                </Button>
              </Flex>
            </Box>
          </TabPanel>
          <TabPanel>
            <Heading
              as="h2"
              size="lg"
              textColor="rgb(25, 16, 91)"
              fontFamily="Arial"
              p="5px"
            >
              Leave
            </Heading>
          </TabPanel>
          <TabPanel>
            <Heading
              as="h2"
              size="lg"
              textColor="rgb(25, 16, 91)"
              fontFamily="Arial"
              p="5px"
            >
              Work From Home
            </Heading>
          </TabPanel>
          <TabPanel>
            <Heading
              as="h2"
              size="lg"
              textColor="rgb(25, 16, 91)"
              fontFamily="Arial"
              p="5px"
            >
              Feedback
            </Heading>
          </TabPanel>
          <TabPanel>
            <Heading
              as="h2"
              size="lg"
              textColor="rgb(25, 16, 91)"
              fontFamily="Arial"
              p="5px"
            >
              Survey
            </Heading>
          </TabPanel>
          <TabPanel>
            <Heading
              as="h2"
              size="lg"
              textColor="rgb(25, 16, 91)"
              fontFamily="Arial"
              p="5px"
            >
              Service Desk
            </Heading>
          </TabPanel>
          <TabPanel>
            <Heading
              as="h2"
              size="lg"
              textColor="rgb(25, 16, 91)"
              fontFamily="Arial"
              p="5px"
            >
              Forms
            </Heading>
          </TabPanel>
          <TabPanel>
            <Heading
              as="h2"
              size="lg"
              textColor="rgb(25, 16, 91)"
              fontFamily="Arial"
              p="5px"
            >
              Travel
            </Heading>
          </TabPanel>
          <TabPanel>
            <Heading
              as="h2"
              size="lg"
              textColor="rgb(25, 16, 91)"
              fontFamily="Arial"
              p="5px"
            >
              Expenses
            </Heading>
          </TabPanel>
          <TabPanel>
            <Heading
              as="h2"
              size="lg"
              textColor="rgb(25, 16, 91)"
              fontFamily="Arial"
              p="5px"
            >
              Resourcing
            </Heading>
          </TabPanel>
        </TabPanels>

        {/* -------- tab panel ends --------- */}
      </Tabs>
    </Box>
  );
};
export default App;
