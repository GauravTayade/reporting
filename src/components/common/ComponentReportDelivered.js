import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEnvelopeCircleCheck} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import {Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/react";
import React from "react";

export default function ComponentReportDelivered(props){
  return(
    <Modal className="bg-blue-900" size="lg" backdrop="blur" isOpen={props.isOpen} onClose={props.onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-white">Greetings!!!</ModalHeader>
            <ModalBody>
              <div className="w-full h-full flex items-center justify-center">
                <div className="flex-col">
                  <div className="w-full h-32 flex">
                    <div className="w-full p-5 flex-col items-center justify-center">
                      <h1 className="text-2xl font-bold text-white border-b-white border-b pb-2">
                        <FontAwesomeIcon className="text-green-500" icon={faEnvelopeCircleCheck}/> | Delivered
                      </h1>
                      <h2 className="text-lg font-semibold text-white">
                        This Report has been Delivered to Customer
                      </h2>
                    </div>
                  </div>
                  <div className="w-full h-16 flex">
                    <div className="w-full p-5 flex items-center justify-center">
                      <Link className="text-white" target="_blank"
                            href="https://access2networks.sharepoint.com/sites/A2NMasterSite/Shared%20Documents/Forms/AllItems.aspx?id=%2Fsites%2FA2NMasterSite%2FShared%20Documents%2FCustomers&viewid=460b0a59%2Daa78%2D4f8e%2Da87f%2D63115b7098e4">View
                        Report</Link>
                    </div>
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="shadow" onPress={props.onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}