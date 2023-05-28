import algoliasearch from "algoliasearch";

const client = algoliasearch("Y7SK456H1S", "635acc591e764f033f19c46631615cd6");

const algolia = client.initIndex("socialCool");

export default algolia;
