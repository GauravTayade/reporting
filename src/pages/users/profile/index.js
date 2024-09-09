import Layout from "@/pages/layout";

export default function Profile(){

  return(
    <>this is profile page</>
  )

}

Profile.getLayout = function getLayout(page){
  return(
    <Layout>
      {page}
    </Layout>
  )
}



