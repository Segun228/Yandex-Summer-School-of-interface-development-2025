module.exports = function markTree(tree){
    const dfs = (Node, shouldBePainted)=>{
        if(shouldBePainted || (Node.isMarked)){
            Node.isMarked = true
            if(!Node.children.length){
                return true;
            }
            for (const child of Node.children){
                dfs(child, true);
            }
            return true;
        }
        if(!Node.children.length){
            return Node.isMarked
        }
        let flag = true
        let childFlag
        for (const child of Node.children){
            childFlag = dfs(child, child.isMarked);
            if(!childFlag){
                flag = false
            }
        }
        if(flag){
            Node.isMarked = true;
            return true
        }
        return false;
    }
    dfs(tree, tree.isMarked);
    return tree;
}


