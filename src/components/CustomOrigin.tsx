import SortableTree, {
  getFlatDataFromTree,
  getTreeFromFlatData,
} from '@nosferatu500/react-sortable-tree'
import '@nosferatu500/react-sortable-tree/style.css'

import { useEffect, useState } from 'react'
import { IListBlocks } from '../types'

const CustomOrigin = () => {
  const [blocks, setBlocks] = useState<IListBlocks[]>([])

  useEffect(() => {
    fetch('http://localhost:7010/blocks')
      .then((response) => response.json())
      .then((response) => setBlocks(response))
  }, [])

  const someOnlineAdvice = {
    treeData: getTreeFromFlatData({
      flatData: blocks.map((node) => ({ ...node, title: node.name })),
      getKey: (node) => node.blockId, // resolve a node's key
      getParentKey: (node) => node.blockParent, // resolve a node's parent's key
      rootKey: '0', // The value of the parent key when there is no parent (i.e., at root level)
    }),
  }

  const flatData = getFlatDataFromTree({
    treeData: someOnlineAdvice.treeData,
    getNodeKey: ({ node }) => node.blockId, // This ensures your "id" properties are exported in the path
    ignoreCollapsed: false, // Makes sure you traverse every node in the tree, not just the visible ones
  }).map(({ node, path }) => ({
    id: node.blockId,
    name: node.name,

    // The last entry in the path is this node's key
    // The second to last entry (accessed here) is the parent node's key
    parent: path.length > 1 ? path[path.length - 2] : null,
  }))
  console.log(flatData)

  const onChange = (treeData: IListBlocks[]) => {
    setBlocks(treeData)
  }

  return (
    <div style={{ height: 800, width: 800 }}>
      <SortableTree treeData={someOnlineAdvice.treeData} onChange={onChange} />
    </div>
  )
}

export default CustomOrigin
