// import { getServerAuthSession } from "~/server/auth";

const Index = () => {
    // const data = await getServerAuthSession();

    return (
        <div>
            <h1>Index</h1>
            {/* <p>{JSON.stringify(data)}</p> */}
            <div className={"bg-red-500"}>lol</div>
            <h1 className="text-3xl font-bold underline">Hello world!</h1>
        </div>
    );
};

export default Index;
