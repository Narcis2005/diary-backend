import Path from "path";
const config = () => {
    if (process.env.NODE_ENV === "test") {
        return { path: Path.normalize(__dirname + "/../../.env.testing") };
    }
    return { path: Path.normalize(__dirname + "/../../.env") };
};
export default config();
