
import Articles from "./Articles/Articles";


function News(props: any) {
  // const hideWarning = useOpenWarnning(false);

  // useEffect(() => {
  //   hideWarning();
  //   document.title = "News & Media";
  // }, []);

  return <NewsPage />;
}

const NewsPage = () => {

  return (
      <Articles/>
  );
};

export default News;
