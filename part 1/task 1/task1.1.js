const start = '2025-02-01'
const end = '2025-02-28'
const data =[
    {
        id: '1',
        deps: ['2'],
        versions: [
            {
                from: '2025-01-01T00:00:00Z',
                to: '2025-02-01T00:00:00Z',
                text: 'String 11',
            },
            {
                from: '2025-02-01T00:00:00Z',
                to: '2025-03-01T00:00:00Z',
                text: 'String 12',
            },
            {
                from: '2025-03-01T00:00:00Z',
                to: '2025-04-01T00:00:00Z',
                text: 'String 13',
            },
        ],
    },
    {
        id: '2',
        deps: [],
        versions: [
            {
                from: '2025-01-01T00:00:00Z',
                to: '2025-02-01T00:00:00Z',
                text: 'String 21',
            },
            {
                from: '2025-02-01T00:00:00Z',
                to: '2025-03-01T00:00:00Z',
                text: 'String 22',
            },
            {
                from: '2025-03-01T00:00:00Z',
                to: '2025-04-01T00:00:00Z',
                text: 'String 23',
            },
        ],
    },
]

const search = (start, end, data)=>{
    const startDate = new Date(start);
    const endDate = new Date(end);
    let flag = true;
    let result = [];
    let currentDepStart, currentDepEnd, currentDep, currentDocStart, currentDocEnd;
    let nominant = "";
    for(const doc of data){
        nominant = "";
        if(new Date(doc.versions[doc.versions.length - 1].to) < startDate || new Date(doc.versions[0].from) > endDate){
            continue;
        }
        if(new Date(doc.versions[0].from) <= startDate){
            currentDocStart = startDate;
        }
        else{
            currentDocStart = new Date(doc.versions[0].from);
        }
        currentDocEnd = new Date(doc.versions[doc.versions.length - 1].to);
        if(currentDocEnd < endDate){
            nominant = doc.versions[doc.versions.length - 1].text;
        }
        else{
            for (let i=doc.versions.length-1; i>=0; i--){
                const versionStart = new Date(doc.versions[i].from);
                const versionEnd = new Date(doc.versions[i].to);
                if (versionStart<=endDate && versionEnd>=startDate){
                    nominant = doc.versions[i].text;
                    break;
                }
            }
            if(nominant===""){
                continue;
            }
        }
        
        if(doc.deps.length === 0){
            result.push(nominant);
            continue;
        }
        flag = true;
        for(const dep of doc.deps){
            const currentDep = data.find((el) => el.id === dep);
            if(!currentDep){
                continue;
            }
            const depStart = new Date(currentDep.versions[0].from);
            const depEnd = new Date(currentDep.versions[currentDep.versions.length - 1].to);
            if(depStart > endDate || depEnd < startDate){
                flag = false;
                break;
            }
            if(!(depStart <= currentDocStart && depEnd >= currentDocEnd)){
                flag = false;
                break;
            }
        }
        if(flag){
            result.push(nominant);
        }
    }
    return result;
}


console.log(search(start, end, data));
const result = search(start, end, data);
document.getElementById('output').textContent = JSON.stringify(result, null, 2);