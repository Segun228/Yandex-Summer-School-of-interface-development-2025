const search = (start, end, data) => {
    const startDate = new Date(start + 'T00:00:00Z');
    const endDate = new Date(end + 'T23:59:59.999Z');
    const isVersionActive=(version)=>{
        const versionStart = version.from ? new Date(version.from) : new Date(-8640000000000000);
        const versionEnd = version.to ? new Date(version.to) : new Date(8640000000000000);
        return ((versionStart <= endDate) && (versionEnd >= startDate));
    };
    const hasActiveVersion = (docId, checked = new Set())=>{
        if (checked.has(docId)){
            return false;
        }
        checked.add(docId);
        const doc = data.find(d => d.id === docId);
        if(!doc){
            return false;}
        const activeVersions = doc.versions.filter(isVersionActive);
        if(activeVersions.length === 0)
            {return false;}
        for (const depId of doc.deps){
            if(!hasActiveVersion(depId, checked)){
                return false;
            }
        }
        return true;
    };
    const result = [];
    for (const doc of data){
        const activeVersions = doc.versions.filter(isVersionActive);
        if(activeVersions.length === 0){
            continue;}
        let depsValid = true;
        for(const depId of doc.deps){
            if(!hasActiveVersion(depId)){
                depsValid = false;
                break;
            }
        }
        if(!depsValid){
            continue;}
        activeVersions.sort((a, b) => new Date(b.from) - new Date(a.from));
        result.push(activeVersions[0].text);
    }
    return result;
};