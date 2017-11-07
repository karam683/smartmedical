// Disclaimer
//
// THIS SAMPLE CODE MAY BE USED SOLELY AS PART OF THE TEST AND EVALUATION OF THE SAP CLOUD PLATFORM BLOCKCHAIN SERVICE (THE “SERVICE”)
// AND IN ACCORDANCE WITH THE TERMS OF THE TEST AND EVALUATION AGREEMENT FOR THE SERVICE. THIS SAMPLE CODE PROVIDED “AS IS”, WITHOUT
// ANY WARRANTY, ESCROW, TRAINING, MAINTENANCE, OR SERVICE OBLIGATIONS WHATSOEVER ON THE PART OF SAP.

package main


import (
	"fmt"
	"encoding/json"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	"github.com/hyperledger/fabric/protos/peer"
	"strings"
	"bytes"
	"time"
 )


// Main function starts up the chaincode in the container during instantiate
//
type SmartMedical struct {}

func main() {
    if err := shim.Start(new(SmartMedical)); err != nil {
		fmt.Printf("Main: Error starting SmartMedical chaincode: %s", err)
	}
}


// Init is called during Instantiate transaction after the chaincode container
// has been established for the first time, allowing the chaincode to
// initialize its internal data. Note that chaincode upgrade also calls this 
// function to reset or to migrate data, so be careful to avoid a scenario 
// where you inadvertently clobber your ledger's data!
//
func (t *SmartMedical) Init(stub shim.ChaincodeStubInterface) peer.Response {
	// Validate supplied init parameters, in this case zero arguments!
	if _, args := stub.GetFunctionAndParameters(); len(args) > 0 {
	    return shim.Error("Init: Incorrect number of arguments; no arguments were expected and none should have been supplied.")
	}
	return shim.Success(nil)
}


// Invoke is called to update or query the ledger in a proposal transaction.
// Updated state variables are not committed to the ledger until the
// transaction is committed.
//
func (cc *SmartMedical) Invoke(stub shim.ChaincodeStubInterface) peer.Response {

	// Which function is been called?
	function, args := stub.GetFunctionAndParameters()
	function = strings.ToLower(function)

	// Route call to the correct function
	switch function {
		case "write":	return cc.write(stub, args)
		case "read":	return cc.read(stub, args);
		case "search":	return cc.search(stub, args);
		case "history": return cc.history(stub, args);
		default:		return shim.Error("Invalid method! Valid methods are (Invoke) 'write' or (Query) 'read|search'!")
	}
}


// Write an ID and string to the blockchain
//
/*type elst struct{
	NM string `json:"nm"`
	ST string `json:"st"`
}*/

type message struct {
	AssetID		string  `json:"assetID"`
	Status   string		`json:"st"`
	Location string 	`json:"location"`
	OwnerRole string 	`json:"ownerrole"`
	OwnerName string 	`json:"ownername"`
	AssetType string 	`json:"assetType"`
	AssetModel string 	`json:"assetModel"`
	FirmwareVersion string 	`json:"firmwareVersion"`
	BuildNumber string 	`json:"buildNumber"`
	BuildBy string 		`json:"buildBy"`
	BatteryLevel string 	`json:"batteryLevel"`
	OwnerId string 	`json:"ownerid"`
	Altitude string 	`json:"Alt"`
	Latitude string 	`json:"Lat"`
	Longitude string 	`json:"Lon"`
	CSts string 	`json:"CSts"`
	BSts string 	`json:"BSts"`
	DSts string 	`json:"DSts"`
	TransactionType string 	`json:"Tmpr"`
	DeviceType string 	`json:"Hmdt"`
}


func (cc *SmartMedical) write(stub shim.ChaincodeStubInterface, args []string) peer.Response {

	//extract the ID and value from the arguments the content and object id
	if len(args) != 20 {
		return shim.Error("Write: incorrect number of arguments; expecting an 20 values to be written.")
	}
	
	/*els1:= &elst{NM:"x", ST:"y"}
	els2:= &elst{NM:"a", ST:"b"}
	els3:= &elst{NM:"c", ST:"d"}
	ElstArray := [3]elst{els1,els2,els3}*/

	id := strings.ToLower(args[0])
	msg := &message{AssetID:args[0],Status:args[1],Location:args[2],OwnerRole:args[3],OwnerName:args[4],AssetType:args[5],AssetModel:args[6],FirmwareVersion:args[7],BuildNumber:args[8],BuildBy:args[9],BatteryLevel:args[10],OwnerId:args[11],Altitude:args[12],Latitude:args[13],Longitude:args[14],CSts:args[15],BSts:args[16],DSts:args[17],TransactionType:args[18],DeviceType:args[19]}
	msgJSON, _ := json.Marshal(msg)

	/*// Validate that this ID does not yet exist:=
	if messageAsBytes, err := stub.GetState(id); err != nil ||  messageAsBytes != nil {
		return shim.Error("Write: this ID already has a message assigned.")
	}*/

	// Write the message
	if err := stub.PutState(id, msgJSON); err != nil {
		return shim.Error(err.Error())
	} else {
		return shim.Success(nil)
	}
}


// Read a string from the blockchain, given its ID
//
func (cc *SmartMedical) read(stub shim.ChaincodeStubInterface, args []string) peer.Response {

	if len(args) != 1 {
		return shim.Error("Read: incorrect number of arguments; expecting only the ID to be read.")
	}
	id := strings.ToLower(args[0])

	if value, err := stub.GetState(id); err != nil || value == nil {
		return shim.Error("Read: invalid ID supplied.")
	} else {
		return shim.Success(value)
	}
}


// Search for a specific ID, given a (regex) value expression. For example: "^H.llo" will match
// any string starting with "Hello" or "Hallo".
//
func (cc *SmartMedical) search(stub shim.ChaincodeStubInterface, args []string) peer.Response {

	if len(args) != 1 {
		return shim.Error("Read: incorrect number of arguments; expecting only the search string.")
	}
	searchString := args[0]

	// stub.GetQueryResult takes a verbatim CouchDB (assuming this is used DB). See CouchDB documentation:
	//     http://docs.couchdb.org/en/2.0.0/api/database/find.html
	// For example:
	//	{
	//		"selector": {
	//			"value": {"$regex": %s"}
	//		},
	//		"fields": ["ID","value"],
	//		"limit":  99
	//	}
	queryString := fmt.Sprintf("{\"selector\": {\"assetID\": {\"$regex\": \"%s\"}}, \"fields\": [\"assetID\",\"st\",\"ownerrole\",\"CSts\",\"BSts\",\"DSts\",\"Tmpr\",\"Hmdt\"], \"limit\":99}", strings.Replace(searchString,"\"",".",-1))
	resultsIterator, err := stub.GetQueryResult(queryString)
	if err != nil {
		return shim.Error(err.Error())
	}
    defer resultsIterator.Close()

    // buffer is a JSON array containing QueryRecords (which are JSON objects)
    var buffer bytes.Buffer
	buffer.WriteString("[")
	for resultsIterator.HasNext() {
		queryResponse, _ := resultsIterator.Next()
        if buffer.Len() > 1 {
        	buffer.WriteString(",")
        }
		buffer.WriteString(string(queryResponse.Value))
	}
	buffer.WriteString("]")

	return shim.Success(buffer.Bytes())
}
func (cc *SmartMedical) history(stub shim.ChaincodeStubInterface, args []string) peer.Response {

if len(args) != 1 {
return shim.Error("Read: incorrect number of arguments; expecting only ID.")
}
id := strings.ToLower(args[0])


resultsIterator, err := stub.GetHistoryForKey(id)
if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

// buffer is a JSON array containing QueryResults
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		// Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"Value\":")
		//buffer.WriteString("\"")
		buffer.Write(queryResponse.Value)
		//buffer.WriteString("\"")

		buffer.WriteString(", \"Timestamp\":")
		buffer.WriteString("\"")
		// Record is a JSON object, so we write as-is
		buffer.WriteString(time.Unix((queryResponse.Timestamp.Seconds),int64(queryResponse.Timestamp.Nanos)).String()) //UTC().Format(time.UnixDate)
		buffer.WriteString("\"")		
		buffer.WriteString("}")

		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	return shim.Success(buffer.Bytes())

}
